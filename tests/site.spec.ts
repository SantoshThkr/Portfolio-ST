import { expect, test, type Page } from "@playwright/test";

const pages = ["/", "/work/opsai", "/work/interviewpilot"];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", message => message.type() === "error" && errors.push(message.text()));
  page.on("pageerror", error => errors.push(error.message));
  return errors;
}

for (const path of pages) {
  test(`${path} renders one h1, no console errors, no broken heading order`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const levels = await page.locator("main h1, main h2, main h3, main h4").evaluateAll(nodes =>
      nodes.map(node => Number(node.tagName[1])),
    );
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i]! - levels[i - 1]!, `heading jump at index ${i}`).toBeLessThanOrEqual(1);
    }
    expect(errors).toEqual([]);
  });

  test(`${path} has canonical, description and valid JSON-LD`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,}/);
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /opengraph-image/);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) expect(() => JSON.parse(block)).not.toThrow();
  });
}

test("no horizontal overflow from small phone to large desktop", async ({ page }) => {
  for (const width of [320, 375, 414, 768, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  }
});

test("every in-page link on the home page has a target", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator('a[href^="#"], a[href^="/#"]').evaluateAll(links =>
    links.map(link => link.getAttribute("href")!.split("#")[1]!),
  );
  expect(hrefs.length).toBeGreaterThan(0);
  for (const id of new Set(hrefs)) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
});

test("case study links from the home page resolve", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator('a[href^="/work/"]').evaluateAll(links => links.map(link => link.getAttribute("href")!));
  expect(new Set(hrefs).size).toBe(2);
  for (const href of new Set(hrefs)) {
    const response = await page.goto(href);
    expect(response?.status(), href).toBe(200);
  }
});

test("external links open safely in a new tab", async ({ page }) => {
  await page.goto("/");
  const links = page.locator('a[target="_blank"]');
  expect(await links.count()).toBeGreaterThan(0);
  for (const rel of await links.evaluateAll(nodes => nodes.map(node => node.getAttribute("rel")))) {
    expect(rel).toContain("noopener");
  }
});

test("résumé PDF and contact email work", async ({ page, request }) => {
  await page.goto("/");
  const response = await request.get("/SantoshThakurResume.pdf");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/pdf");
  await expect(page.locator('#contact a[href^="mailto:"]').first()).toHaveAttribute("href", /^mailto:[^@]+@[^@]+\.[^@]+$/);
});

test("skip link moves focus to main content", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("mobile menu opens, closes with Escape and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Menu" });
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  const menu = page.locator("#mobile-menu");
  await expect(menu.getByRole("link", { name: "Experience" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();

  await page.getByRole("button", { name: "Menu" }).click();
  await menu.getByRole("link", { name: "Contact" }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#contact$/);
});

test("touch targets in navigation are at least 44px tall", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  const heights = await page
    .locator("#mobile-menu a, .site-header button, footer a")
    .evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height));
  for (const height of heights) expect(height).toBeGreaterThanOrEqual(44);
});

test("architecture diagrams are ordered lists with labelled paths", async ({ page }) => {
  await page.goto("/work/opsai");
  const lists = page.locator("figure ol[aria-labelledby]");
  await expect(lists).toHaveCount(3);
  await expect(lists.first().locator("li")).toHaveCount(5);
});

test("unknown routes return a helpful 404", async ({ page }) => {
  const response = await page.goto("/work/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("doesn't exist");
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1);
});

test("robots, sitemap, manifest and OG images are served", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://santosht.dev/sitemap.xml");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/work/opsai", "/work/interviewpilot"]) expect(sitemap).toContain(`https://santosht.dev${path}`);
  expect((await request.get("/manifest.webmanifest")).ok()).toBeTruthy();
  for (const path of ["/opengraph-image", "/work/opsai/opengraph-image"]) {
    const response = await request.get(path);
    expect(response.headers()["content-type"]).toContain("image/png");
  }
});

test("security headers are set", async ({ request }) => {
  const headers = (await request.get("/")).headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("reduced motion disables the hero animation", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const animation = await page.locator("#hero-title").evaluate(node => getComputedStyle(node).animationName);
  expect(animation).toBe("none");
  await context.close();
});

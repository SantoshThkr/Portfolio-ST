import { test, expect } from "@playwright/test";

test("homepage renders the hero with no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("/");
  await expect(page.locator("#hero-title")).toBeVisible();
  expect(errors).toEqual([]);
});

test("every primary nav link points to a section that exists on the page", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page
    .locator('nav[aria-label="Primary navigation"] a[href^="#"]')
    .evaluateAll((els) => els.map((el) => el.getAttribute("href")));

  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    const id = href!.slice(1);
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test("external social/GitHub links open in a new tab safely", async ({ page }) => {
  await page.goto("/");
  const github = page.getByRole("link", { name: "GitHub" }).first();
  await expect(github).toHaveAttribute("target", "_blank");
  await expect(github).toHaveAttribute("rel", /noreferrer/);
});

test("contact email link is a well-formed mailto", async ({ page }) => {
  await page.goto("/");
  const href = await page.locator('#contact a[href^="mailto:"]').first().getAttribute("href");
  expect(href).toMatch(/^mailto:[^@]+@[^@]+\.[^@]+/);
});

test("resume asset is available and linked", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Resume" }).first()).toHaveAttribute("href", "/SantoshThakurResume.pdf");
  const response = await request.get("/SantoshThakurResume.pdf");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

test("mobile navigation opens and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menuButton = page.getByRole("button", { name: "Open navigation menu" });
  await menuButton.click();
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-navigation")).toBeHidden();
});

test("project cards expose their engineering focus and links", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "InterviewPilot" })).toBeVisible();
  await expect(page.getByText("Engineering focus").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "GitHub" }).first()).toHaveAttribute("target", "_blank");
});

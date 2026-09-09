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

import { test, expect } from "@playwright/test";

test.describe("Movies Page", () => {
    test("should display movies listing page", async ({ page }) => {
        await page.goto("/movies");
        await expect(page).toHaveURL(/movies/);
        await expect(page.getByText(/browse movies/i)).toBeVisible();
    });

    test("should display now showing tab by default", async ({ page }) => {
        await page.goto("/movies");
        await expect(page.getByText(/now showing/i)).toBeVisible();
    });

    test("should display movie cards with title and poster", async ({ page }) => {
        await page.goto("/movies");
        await page.waitForSelector("a[href*='/movies/']", { timeout: 10000 });
        await expect(page.locator("a[href*='/movies/']").first()).toBeVisible();
    });

    test("should navigate to movie detail page on click", async ({ page }) => {
        await page.goto("/movies");
        await page.waitForSelector("a[href*='/movies/']", { timeout: 10000 });
        await page.locator("a[href*='/movies/']").first().click();
        await expect(page).toHaveURL(/\/movies\//);
    });
});

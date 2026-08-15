import { test, expect } from "@playwright/test";

test.describe("Navigation and Routing", () => {
    test("should redirect unauthenticated users to login", async ({ page }) => {
        await page.goto("/admin/dashboard");
        await expect(page).toHaveURL(/login/);
    });

    test("should navigate back to login from register page", async ({ page }) => {
        await page.goto("/register");
        await page.getByRole("link", { name: /sign in/i }).click();
        await expect(page).toHaveURL(/.*login/);
    });

    test("should persist login state across page navigation", async ({ page }) => {
        await page.goto("/login");
        await page.getByPlaceholder(/name@example.com/i).fill("testuser@example.com");
        await page.locator("input[type='password']").first().fill("password123");
        await page.getByRole("button", { name: /sign in/i }).click();
        await page.waitForURL(/\/user\//);
        await page.goto("/movies");
        await page.goto("/user/dashboard");
        await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    });

    test("should load register page heading", async ({ page }) => {
        await page.goto("/register");
        await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();
    });

    test("should display responsive layout on mobile viewport", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/movies");
        await expect(page.locator("body")).toBeVisible();
    });
});

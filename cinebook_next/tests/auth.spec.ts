import { test, expect } from "@playwright/test";

test.describe("Auth Pages", () => {
    test("should display login page with email and password fields", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByPlaceholder(/name@example.com/i)).toBeVisible();
        await expect(page.locator("input[type='password']").first()).toBeVisible();
        await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
    });

    test("should display register page with all required fields", async ({ page }) => {
        await page.goto("/register");
        await expect(page.getByPlaceholder("John Doe")).toBeVisible();
        await expect(page.getByPlaceholder(/john@example.com/i)).toBeVisible();
        await expect(page.getByPlaceholder("johndoe")).toBeVisible();
        await expect(page.getByPlaceholder(/\+1234567890/i)).toBeVisible();
        await expect(page.locator("input[type='password']").first()).toBeVisible();
        await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
    });

    test("should navigate from login to forget password page", async ({ page }) => {
        await page.goto("/login");
        await page.locator("a[href='/forget-password']").click();
        await expect(page).toHaveURL(/.*forget-password/);
    });

    test("should navigate from login to register page", async ({ page }) => {
        await page.goto("/login");
        await page.getByRole("link", { name: /create one/i }).click();
        await expect(page).toHaveURL(/.*register/);
    });
});

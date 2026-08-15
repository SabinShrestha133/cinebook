import { test, expect } from "@playwright/test";

test.describe("User Pages", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
        await page.getByPlaceholder(/name@example.com/i).fill("testuser@example.com");
        await page.locator("input[type='password']").first().fill("password123");
        await page.getByRole("button", { name: /sign in/i }).click();
        await page.waitForURL(/\/user\//);
    });

    test("should display user dashboard", async ({ page }) => {
        await page.goto("/user/dashboard");
        await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    });

    test("should display user profile page", async ({ page }) => {
        await page.goto("/user/profile");
        await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible();
        await expect(page.getByText("Name", { exact: true })).toBeVisible();
        await expect(page.getByText("Email", { exact: true })).toBeVisible();
    });

    test("should update profile name successfully", async ({ page }) => {
        await page.goto("/user/profile/edit");
        const nameInput = page.locator("input[name='name']");
        await nameInput.clear();
        await nameInput.fill("Updated Name");
        await page.getByRole("button", { name: /save changes/i }).click();
        await expect(page.getByText("Profile updated successfully")).toBeVisible();
    });

    test("should display user bookings page", async ({ page }) => {
        await page.goto("/user/bookings");
        await expect(page.getByRole("heading", { name: /your bookings/i })).toBeVisible();
    });

    test("should logout and redirect to login", async ({ page }) => {
        await page.goto("/user/dashboard");
        await page.locator("nav button:not([title])").click();
        await page.getByRole("button", { name: /logout/i }).click();
        await expect(page).toHaveURL(/login/);
    });
});

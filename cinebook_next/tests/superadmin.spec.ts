import { test, expect } from "@playwright/test";

test.describe("Super Admin Pages", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
        await page.getByPlaceholder(/name@example.com/i).fill("superadmin@example.com");
        await page.locator("input[type='password']").first().fill("adminpass");
        await page.getByRole("button", { name: /sign in/i }).click();
        await page.waitForURL(/super-admin/);
    });

    test("should display super admin dashboard", async ({ page }) => {
        await page.goto("/super-admin/dashboard");
        await expect(page.getByRole("heading", { name: /admin panel/i })).toBeVisible();
    });

    test("should list all admins", async ({ page }) => {
        await page.goto("/super-admin/dashboard");
        await expect(page.getByText(/admin@cinebook.local/i)).toBeVisible();
    });

    test("should create a new admin user", async ({ page }) => {
        await page.goto("/super-admin/dashboard");
        await page.getByRole("button", { name: /new admin/i }).click();
        await expect(page.locator("input[name='name']")).toBeVisible();
    });
});

import { test, expect } from "@playwright/test";

test.describe("Admin Pages", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
        await page.getByPlaceholder(/name@example.com/i).fill("admin@cinebook.local");
        await page.locator("input[type='password']").first().fill("adminpass");
        await page.getByRole("button", { name: /sign in/i }).click();
        await page.waitForURL(/\/admin\//);
    });

    test("should display admin dashboard", async ({ page }) => {
        await page.goto("/admin/dashboard");
        await expect(page.getByRole("heading", { name: /admin dashboard/i })).toBeVisible();
    });

    test("should display admin users management page", async ({ page }) => {
        await page.goto("/admin/users");
        await expect(page.getByRole("heading", { name: /user management/i })).toBeVisible();
    });

    test("should view all bookings from admin panel", async ({ page }) => {
        await page.goto("/admin/bookings");
        await expect(page.getByRole("heading", { name: /bookings/i })).toBeVisible();
    });

    test("should not access super-admin routes as admin", async ({ page }) => {
        await page.goto("/super-admin/dashboard");
        await expect(page.getByText(/admin panel/i)).not.toBeVisible();
    });
});

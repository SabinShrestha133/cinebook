# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation and Routing >> should navigate back to login from register page
- Location: tests\navigation.spec.ts:9:9

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*login/
Received string:  "http://localhost:3000/register"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    12 × locator resolved to <html lang="en" data-theme="dark" class="geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable h-full antialiased">…</html>
       - unexpected value "http://localhost:3000/register"

```

```yaml
- img "CineBook Logo"
- heading "CineBook" [level=1]
- paragraph: Movie Ticket Booking System
- heading "Create Account" [level=2]
- paragraph: Join CineBook to book movie tickets
- text: Full Name
- textbox "John Doe"
- text: Email Address
- textbox "john@example.com"
- text: Username
- textbox "johndoe"
- text: Phone Number
- textbox "+1234567890"
- text: Password
- textbox "••••••••"
- button
- text: Confirm Password
- textbox "••••••••"
- button
- button "Create Account"
- text: or
- paragraph:
  - text: Already have an account?
  - link "Sign in":
    - /url: /login
- region "Notifications Alt+T"
- alert
```

```
Tearing down "context" exceeded the test timeout of 30000ms.
```
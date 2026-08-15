# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth Pages >> should navigate from login to register page
- Location: tests\auth.spec.ts:27:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*register/
Received string:  "http://localhost:3000/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    5 × locator resolved to <html lang="en" data-theme="dark" class="geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable h-full antialiased">…</html>
      - unexpected value "http://localhost:3000/login"

```

```yaml
- img "CineBook Logo"
- heading "CineBook" [level=1]
- paragraph: Movie Ticket Booking System
- heading "Welcome Back" [level=2]
- paragraph: Please enter your details to sign in
- text: Email Address
- textbox "name@example.com"
- text: Password
- textbox "••••••••"
- button
- button "Sign In"
- text: or
- paragraph:
  - text: Don't have an account?
  - link "Create one":
    - /url: /register
- paragraph:
  - link "Forgot password?":
    - /url: /forget-password
- region "Notifications Alt+T"
- alert
```

```
Tearing down "context" exceeded the test timeout of 30000ms.
```
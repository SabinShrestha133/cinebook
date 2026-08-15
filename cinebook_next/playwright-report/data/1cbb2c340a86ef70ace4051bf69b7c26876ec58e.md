# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth Pages >> should navigate from login to forget password page
- Location: tests\auth.spec.ts:21:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Tearing down "context" exceeded the test timeout of 30000ms.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic:
        - img "CineBook Logo"
      - heading "CineBook" [level=1] [ref=e5]
      - paragraph [ref=e6]: Movie Ticket Booking System
    - generic [ref=e8]:
      - heading "Welcome Back" [level=2] [ref=e9]
      - paragraph [ref=e10]: Please enter your details to sign in
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: Email Address
        - textbox "name@example.com" [ref=e19]
      - generic [ref=e20]:
        - generic [ref=e21]: Password
        - generic [ref=e22]:
          - textbox "••••••••" [ref=e27]
          - button [ref=e28]
      - button "Sign In" [ref=e32]
    - generic [ref=e33]: or
    - paragraph [ref=e37]:
      - text: Don't have an account?
      - link "Create one" [ref=e38] [cursor=pointer]:
        - /url: /register
    - paragraph [ref=e39]:
      - link "Forgot password?" [ref=e40] [cursor=pointer]:
        - /url: /forget-password
  - region "Notifications Alt+T"
```
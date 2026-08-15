# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation and Routing >> should load register page heading
- Location: tests\navigation.spec.ts:26:9

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
      - heading "Create Account" [level=2] [ref=e9]
      - paragraph [ref=e10]: Join CineBook to book movie tickets
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: Full Name
        - textbox "John Doe" [ref=e19]
      - generic [ref=e20]:
        - generic [ref=e21]: Email Address
        - textbox "john@example.com" [ref=e27]
      - generic [ref=e28]:
        - generic [ref=e29]: Username
        - textbox "johndoe" [ref=e35]
      - generic [ref=e36]:
        - generic [ref=e37]: Phone Number
        - textbox "+1234567890" [ref=e43]
      - generic [ref=e44]:
        - generic [ref=e45]: Password
        - generic [ref=e46]:
          - textbox "••••••••" [ref=e51]
          - button [ref=e52]
      - generic [ref=e56]:
        - generic [ref=e57]: Confirm Password
        - generic [ref=e58]:
          - textbox "••••••••" [ref=e63]
          - button [ref=e64]
      - button "Create Account" [ref=e68]
    - generic [ref=e69]: or
    - paragraph [ref=e73]:
      - text: Already have an account?
      - link "Sign in" [ref=e74] [cursor=pointer]:
        - /url: /login
  - region "Notifications Alt+T"
```
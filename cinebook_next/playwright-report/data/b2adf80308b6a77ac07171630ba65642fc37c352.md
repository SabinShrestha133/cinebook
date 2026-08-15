# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation and Routing >> should redirect unauthenticated users to login
- Location: tests\navigation.spec.ts:4:9

# Error details

```
Tearing down "context" exceeded the test timeout of 30000ms.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img "CineBook Logo" [ref=e6]
      - heading "CineBook" [level=1] [ref=e7]
      - paragraph [ref=e8]: Movie Ticket Booking System
    - generic [ref=e10]:
      - heading "Welcome Back" [level=2] [ref=e11]
      - paragraph [ref=e12]: Please enter your details to sign in
    - generic [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]: Email Address
        - textbox "name@example.com" [ref=e21]
      - generic [ref=e22]:
        - generic [ref=e23]: Password
        - generic [ref=e24]:
          - textbox "••••••••" [ref=e29]
          - button [ref=e30]
      - button "Sign In" [ref=e34]
    - generic [ref=e35]: or
    - paragraph [ref=e39]:
      - text: Don't have an account?
      - link "Create one" [ref=e40] [cursor=pointer]:
        - /url: /register
    - paragraph [ref=e41]:
      - link "Forgot password?" [ref=e42] [cursor=pointer]:
        - /url: /forget-password
  - region "Notifications Alt+T"
  - button "Open Next.js Dev Tools" [ref=e48] [cursor=pointer]:
    - generic [ref=e51]:
      - text: Compiling
      - generic [ref=e52]:
        - generic [ref=e53]: .
        - generic [ref=e54]: .
        - generic [ref=e55]: .
  - alert [ref=e56]
```
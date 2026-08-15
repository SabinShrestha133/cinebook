# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation and Routing >> should display responsive layout on mobile viewport
- Location: tests\navigation.spec.ts:31:9

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e5]:
        - link "CineBook" [ref=e9] [cursor=pointer]:
          - /url: /user/dashboard
        - generic [ref=e10]:
          - button "Switch to light mode" [ref=e11]
          - button "User" [ref=e19]
    - main [ref=e26]:
      - generic [ref=e28]:
        - generic [ref=e29]:
          - generic [ref=e30]:
            - paragraph [ref=e31]: CineBook
            - heading "Browse Movies" [level=1] [ref=e32]
            - paragraph [ref=e33]: Discover current and upcoming movies available for booking through the CineBook API.
          - link "Create an account" [ref=e34] [cursor=pointer]:
            - /url: /register
        - generic [ref=e36]:
          - button "Now Showing (0)" [ref=e37]
          - button "Upcoming (0)" [ref=e38]
        - button "Filter by Genre" [ref=e40]
        - generic [ref=e43]: Loading movies…
  - region "Notifications Alt+T"
```
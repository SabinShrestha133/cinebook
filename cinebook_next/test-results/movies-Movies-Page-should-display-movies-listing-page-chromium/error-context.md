# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: movies.spec.ts >> Movies Page >> should display movies listing page
- Location: tests\movies.spec.ts:4:9

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
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e5]:
        - link "CineBook" [ref=e9] [cursor=pointer]:
          - /url: /user/dashboard
        - generic [ref=e10]:
          - button "Switch to light mode" [ref=e11]
          - button "User" [ref=e19]
    - main [ref=e27]:
      - generic [ref=e29]:
        - generic [ref=e30]:
          - generic [ref=e31]:
            - paragraph [ref=e32]: CineBook
            - heading "Browse Movies" [level=1] [ref=e33]
            - paragraph [ref=e34]: Discover current and upcoming movies available for booking through the CineBook API.
          - link "Create an account" [ref=e35] [cursor=pointer]:
            - /url: /register
        - generic [ref=e37]:
          - button "Now Showing (0)" [ref=e38]
          - button "Upcoming (0)" [ref=e39]
        - button "Filter by Genre" [ref=e41]
        - generic [ref=e44]: Loading movies…
  - region "Notifications Alt+T"
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Pages >> should display admin dashboard
- Location: tests\admin.spec.ts:12:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Tearing down "context" exceeded the test timeout of 30000ms.
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - generic [ref=f1e2]:
    - navigation [ref=f1e3]:
      - generic [ref=f1e5]:
        - link "CineBook" [ref=f1e9] [cursor=pointer]:
          - /url: /admin/dashboard
        - generic [ref=f1e10]:
          - button "Switch to light mode" [ref=f1e11]
          - button "Admin" [ref=f1e19]
    - main [ref=f1e27]
  - region "Notifications Alt+T"
  - button "Open Next.js Dev Tools" [ref=f1e36] [cursor=pointer]
  - alert [ref=f1e40]
```
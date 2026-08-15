# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Pages >> should display admin users management page
- Location: tests\admin.spec.ts:17:9

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
    - main [ref=f1e27]:
      - generic [ref=f1e28]:
        - generic [ref=f1e29]:
          - generic [ref=f1e37]:
            - heading "User Management" [level=1] [ref=f1e38]
            - paragraph [ref=f1e39]: View, edit and delete users
          - generic [ref=f1e40]:
            - button "Refresh" [ref=f1e41]
            - textbox "Search users..." [ref=f1e51]
        - table [ref=f1e53]:
          - rowgroup [ref=f1e54]:
            - row [ref=f1e55]:
              - columnheader "Name" [ref=f1e56]
              - columnheader "Email" [ref=f1e57]
              - columnheader "Phone" [ref=f1e58]
              - columnheader "Role" [ref=f1e59]
              - columnheader "Status" [ref=f1e60]
              - columnheader "Actions" [ref=f1e61]
          - rowgroup [ref=f1e62]:
            - row [ref=f1e63]:
              - cell [ref=f1e64]
  - region "Notifications Alt+T"
```
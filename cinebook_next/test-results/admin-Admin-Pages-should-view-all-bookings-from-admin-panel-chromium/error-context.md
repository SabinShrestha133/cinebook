# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Pages >> should view all bookings from admin panel
- Location: tests\admin.spec.ts:22:9

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
          - button "Super Admin" [ref=f1e19]
    - main [ref=f1e27]:
      - generic [ref=f1e28]:
        - generic [ref=f1e29]:
          - generic [ref=f1e34]:
            - heading "Bookings" [level=1] [ref=f1e35]
            - paragraph [ref=f1e36]: See who booked which movie, seat and showtime
          - generic [ref=f1e37]:
            - button "Refresh" [ref=f1e38]
            - textbox "Search bookings..." [ref=f1e48]
        - generic [ref=f1e49]: "Forbidden: insufficient permissions"
        - table [ref=f1e52]:
          - rowgroup [ref=f1e53]:
            - row [ref=f1e54]:
              - columnheader "User" [ref=f1e55]
              - columnheader "Movie" [ref=f1e56]
              - columnheader "Cinema" [ref=f1e57]
              - columnheader "Showtime" [ref=f1e58]
              - columnheader "Seats" [ref=f1e59]
              - columnheader "Amount" [ref=f1e60]
              - columnheader "Status" [ref=f1e61]
          - rowgroup [ref=f1e62]:
            - row [ref=f1e63]:
              - cell "No bookings found" [ref=f1e64]
  - region "Notifications Alt+T"
  - button "Open Next.js Dev Tools" [ref=f1e70] [cursor=pointer]:
    - generic [ref=f1e73]:
      - text: Compiling
      - generic [ref=f1e74]:
        - generic [ref=f1e75]: .
        - generic [ref=f1e76]: .
        - generic [ref=f1e77]: .
  - alert [ref=f1e78]
```
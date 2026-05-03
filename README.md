# OpsFlow Automation Console (GitHub Pages Static Prototype)

A custom-built operations automation prototype designed for a **Make/Zapier Automation Specialist** to present client workflow logic.

This demo is intentionally styled as an internal operations console (not a generic SaaS dashboard) and simulates:

- **Intake Inbox** (Gmail label: `Client Requests`)
- **Parser Output**
- **Project Tracker** (Sheet: `Project Milestones Tracker`)
- **Calendar Queue** (Calendar: `Operations Calendar`)
- **Offer / Invoice Draft** (prefix: `OFF-`)
- **Automation Health** with error handling for:
  - Missing deadline
  - Missing budget
  - Invalid email

## Feature Set

- Left-side **workflow rail** with live step status
- Guided demo mode
- Before Automation vs After Automation comparison
- Client Value section
- CSV export from tracker table
- Invoice draft preview
- Pure HTML/CSS/JS (GitHub Pages compatible)

## Run Locally

Open `index.html` in a browser.

Optional local server:

```bash
python3 -m http.server 8080
```

Then browse to `http://localhost:8080`.

## Deploy to GitHub Pages

1. Push repo to GitHub.
2. Open **Settings → Pages**.
3. Set source to **Deploy from a branch**.
4. Use branch **main** and folder **/ (root)**.
5. Save.

Expected URL pattern:

`https://<your-username>.github.io/autoflow-automation-demo/`

# AutoFlow Automation Demo (GitHub Pages Ready)

A polished client-facing static demo for showcasing this workflow:

**Gmail → AI Parsing → Google Sheets → Calendar → Offers & Invoices**

## What’s Included

- Professional dashboard UI for client presentations
- Editable **Automation Settings** page:
  - Gmail label
  - Google Sheet name
  - Calendar reminder
  - Invoice prefix
  - Default status
- Searchable tracker table with **CSV export**
- Professional invoice preview panel
- Error simulation for:
  - Missing deadline
  - Missing budget
  - Invalid email
- Make/Zapier-style workflow builder page
- Guided demo mode with automatic step highlighting
- 100% static frontend (no backend, API keys, or paid tools)

## Local Usage

Open `index.html` directly in your browser.

(Optional) Serve locally:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
4. Save.

Site URL format:

`https://<your-username>.github.io/autoflow-automation-demo/`

## Demo Script (for Upwork calls)

1. Click **Start Guided Demo**.
2. Show incoming email sample and click **Run Automation**.
3. Open **Tracker** and export CSV.
4. Open **Automation Settings** and edit values.
5. Open **Invoice Preview** and show generated draft.
6. Trigger each **Error Handling Simulation** case.
7. Open **Workflow Builder** to explain Make/Zapier flow logic.

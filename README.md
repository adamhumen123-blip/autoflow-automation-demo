# Gmail Subject Email Extractor (Static Demo)

A polished front-end demo tailored for an Upwork automation job focused on **extracting email addresses from Gmail subject lines**.

This project is intentionally static (HTML/CSS/JS only) and simulates a Gmail-to-Sheets extraction workflow without backend integrations.

## Demo Positioning

**Gmail Subject Email Extractor**

Automated Gmail workflow for scanning subject lines, extracting email addresses, removing duplicates, and exporting clean results to Google Sheets.

## Included Workflow Steps

1. Gmail Search
2. Subject Scanner
3. Regex Email Extractor
4. Duplicate Cleaner
5. Google Sheets Export
6. Automation Health

## What the Demo Shows

- Sample Gmail subject lines (including Etsy confirmation examples)
- Regex-based email extraction from subject text
- Order ID capture from subject lines
- Duplicate removal logic for cleaner exports
- Output table with columns:
  - Date
  - Extracted Email
  - Subject
  - Order ID
  - Status
- CSV export preview suitable for Google Sheets upload
- Batch-processing framing with resume cursor messaging to avoid timeout issues

## Run Locally

Open `index.html` in your browser.

Optional local server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Notes

- No backend functionality is included.
- This is a front-end demo for showcasing workflow logic and UI presentation.

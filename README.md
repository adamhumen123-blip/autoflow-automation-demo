# Gmail Subject Email Extractor (Static Demo)

A polished front-end demo tailored for an automation job focused on **extracting email addresses from Gmail subject lines**.

This project is intentionally static (HTML/CSS/JS only) and simulates a Gmail-to-Sheets extraction workflow without backend integrations.

## Demo Positioning

**Title**

Gmail Subject Email Extractor

**Subtitle**

Automated Gmail workflow for scanning subject lines, extracting email addresses, removing duplicates, and exporting clean results to Google Sheets.

## Included Workflow Rail

1. Gmail Search
2. Subject Scanner
3. Regex Email Extractor
4. Duplicate Cleaner
5. Google Sheets Export
6. Automation Health

## Sample Subject Lines Included

- Etsy Confirmación de pedido por: 3,74 € de: choco-boubou@hotmail.fr (4052703070)
- Etsy Confirmación de pedido por: 3,71 € de: karin.vandermost@web.de (4052663706)
- Etsy Confirmación de pedido por: 3,71 € de: jenny.radeck@web.de (405719139)

## Output Table Columns

- Date
- Extracted Email
- Subject
- Order ID
- Status

## Workflow Explanation Included in Demo

- Batch processing for 300,000+ Gmail messages
- Gmail search filters
- Regex extraction from subject lines
- Duplicate removal
- Google Sheets export
- Resume from last processed batch to avoid Apps Script timeouts

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

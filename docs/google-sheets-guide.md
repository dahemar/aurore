# Google Sheets CMS Guide for Aurore

This project reads content from a public Google Sheet and renders it in the site (Vite + React). Use this guide to update texts and images without changing code.

## Quick links
- Spreadsheet: add your own link here (e.g., https://docs.google.com/...)
- Tabs used by the site:
  - `page1_je_mappelle_aurore`
  - `page2_topographie_etrange`
  - `page3_reliques_reve`
  - `page4_memoires_mont_songe`

## 1) Sheet visibility
- Open the spreadsheet → Share → General access → set to "Anyone with the link" as Viewer.
- No login is required on the website; the app fetches CSV exports of each tab.

## 2) Required tab schemas

### Tab: `page2_topographie_etrange`
- Columns (header row):
  - `image_url` (string) – Public image URL (see "Images" below)
  - `caption` (string) – Short text under each image
  - `size` (string) – `normal` or `big`
- Each row = one gallery item.
- Notes:
  - The page randomizes positions every load; coordinates are NOT taken from the sheet.
  - On mobile the component automatically reduces sizes and spacing.

### Tab: `page4_memoires_mont_songe`
- Columns (header row):
  - `text_type` (string) – `introductory_quote` or `main_content`
  - `content` (string) – The text content. Line breaks are preserved.
- Tips:
  - For long texts, you can split the main content into paragraphs in one cell by adding blank lines. The site will render each paragraph separately.

### Optional tabs (currently read-only or unused)
- `page1_je_mappelle_aurore`, `page3_reliques_reve` can be created for future content but are not strictly required now.

## 3) Images
- Use publicly accessible URLs. Options:
  - Host in the repository under `react-app/public/images` and reference with `${BASE_URL}images/<filename>`.
  - Use an external host (e.g., Google Drive with public share + direct file link, Imgur, Cloudinary).
- Recommended sizes: 800–1600px wide (JPG/WEBP). The site auto-scales for mobile.

## 4) How the site reads the sheet
- The frontend requests each tab via Google Sheets CSV export endpoint.
- Example pattern (CSV export):
  - `https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?tqx=out:csv&sheet=<TAB_NAME>`
- The data hook `useSheetData(<tab_name>)` fetches and caches results in memory (no server needed).
- Changes appear immediately on refresh. If you don’t see them, hard-refresh the page (Cmd/Ctrl+Shift+R).

## 5) Editing workflow
1. Open the sheet and go to the desired tab.
2. Edit cells in the header-defined columns only.
3. Keep one header row; do not rename columns unless updating the code accordingly.
4. Refresh the site page to see the changes.

## 6) Common issues
- Empty page: make sure the tab name matches exactly: `page2_topographie_etrange`, `page4_memoires_mont_songe`.
- Images not visible: confirm the `image_url` is publicly reachable and points directly to the image file.
- Quote breaks not preserved: ensure your `introductory_quote` cell uses actual line breaks. The site renders them with `white-space: pre-line`.

## 7) Advanced
- You can duplicate the spreadsheet for staging. Update the SHEET_ID in `react-app/src/utils/sheetsApi.js` (if configured) to point to the new sheet.
- If using external image CDNs, prefer WEBP/JPG to keep downloads light.

## 8) Exporting this guide to PDF
- Open `docs/google-sheets-guide.html` in a browser and print to PDF (File → Print → Save as PDF). The HTML is styled for printing. 
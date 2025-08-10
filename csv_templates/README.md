# Google Sheets CMS - CSV Templates

This directory contains CSV templates for setting up Google Sheets as a headless CMS for the Aurore Delune website.

## Files Structure

### 1. **page1_je_mappelle_aurore.csv**
- **Page**: Je m'appelle Aurore Delune
- **Content**: Contact form and main image
- **Columns**: title, content, image_url, form_title, form_description

### 2. **page2_topographie_etrange.csv**
- **Page**: Topographie de l'étrange
- **Content**: Floating gallery with 4 draggable images
- **Columns**: title, image_url, caption, position_x, position_y, size

### 3. **page3_reliques_reve.csv**
- **Page**: Reliques du rêve
- **Content**: Poetry and main image
- **Columns**: title, content, image_url

### 4. **page4_memoires_mont_songe.csv**
- **Page**: Mémoires du Mont Songe
- **Content**: Complete text content with all sections
- **Columns**: title, content, date, image_url

### 5. **general_config.csv**
- **Purpose**: Global website configuration
- **Content**: Site settings, images, and audio files
- **Columns**: setting, value, description

## Setup Instructions

### Step 1: Create Google Sheets
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Create **5 sheets** with these exact names:
   - `page1_je_mappelle_aurore`
   - `page2_topographie_etrange`
   - `page3_reliques_reve`
   - `page4_memoires_mont_songe`
   - `general_config`

### Step 2: Import CSV Data
1. Open each sheet
2. Copy the corresponding CSV content
3. Paste into the sheet (Google Sheets will auto-format)

### Step 3: Share and Get Access
1. Click "Share" button
2. Set to "Anyone with the link can view"
3. Copy the spreadsheet ID from the URL:
   - Format: `https://docs.google.com/spreadsheets/d/`**`SPREADSHEET_ID`**`/edit`
   - The long string between `/d/` and `/edit` is your ID

### Step 4: Configure API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create API credentials (API Key)
5. Set restrictions to your domain

### Step 5: Environment Variables
Create a `.env` file in your project root:
```env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_SPREADSHEET_ID=your_spreadsheet_id_here
```

## Content Management

Once set up, you can:
- **Edit text content** directly in Google Sheets
- **Update images** by changing URLs in the sheets
- **Modify form labels** and descriptions
- **Change audio file references**
- **Update site configuration**

All changes will be reflected on the website after refreshing (with 5-minute cache).

## Notes

- **Images**: Use Google Drive direct links or relative paths
- **Audio**: Use relative paths from the audio/ directory
- **Text**: Supports line breaks and special characters
- **Cache**: Data is cached for 5 minutes to reduce API calls
- **Security**: API key should be restricted to your domain only 
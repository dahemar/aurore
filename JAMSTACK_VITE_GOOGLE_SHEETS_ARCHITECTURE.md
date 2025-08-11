# JAMstack Architecture with Vite + Google Sheets Integration

## Overview

This document explains how to implement a **JAMstack (JavaScript, APIs, Markup)** architecture using **Vite** as the build tool and **Google Sheets** as a headless CMS. This approach provides a cost-effective, scalable solution for content-driven websites that can be easily managed by non-technical users.

## Architecture Components

### 1. Frontend Stack
- **Vite**: Modern build tool for fast development and optimized production builds
- **React**: UI library for building interactive components
- **React Router**: Client-side routing
- **CSS Modules**: Scoped styling

### 2. Content Management
- **Google Sheets**: Headless CMS for content management
- **Google Sheets API**: REST API for fetching data
- **Google Drive**: Image hosting and file storage

### 3. Deployment
- **Static Site Generation**: Pre-built HTML/CSS/JS files
- **CDN**: Global content delivery
- **Custom Domain**: Professional web presence

## Project Structure

```
project/
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   ├── pages/               # Route components
│   │   ├── Works.jsx        # Content listing page
│   │   ├── WorkDetail.jsx   # Individual content page
│   │   └── ...
│   ├── styles.css           # Global styles
│   └── ...
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── index.html              # HTML template
```

## Core Implementation Patterns

### 1. Google Sheets API Integration

```javascript
// Configuration constants
const SPREADSHEET_ID = 'your-spreadsheet-id';
const API_KEY = 'your-google-api-key';
const RANGE = 'SheetName!A2:D'; // Skip header row
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';

// Data fetching function
async function fetchSheetData() {
  try {
    const url = `${BASE_URL}${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error fetching data');
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
```

### 2. React Hook for Data Management

```javascript
import { useState, useEffect } from 'react';

function useSheetData(spreadsheetId, range, apiKey) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching data');
        const result = await response.json();
        setData(result.values || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [spreadsheetId, range, apiKey]);

  return { data, loading, error };
}
```

### 3. Content Mapping and Processing

```javascript
// Map raw sheet data to structured content
function mapSheetDataToContent(rawData, contentStructure) {
  return rawData.map(row => {
    const content = {};
    contentStructure.forEach((field, index) => {
      content[field] = row[index] || '';
    });
    return content;
  });
}

// Example usage for blog posts
const blogStructure = ['date', 'title', 'description', 'imageUrl'];
const blogPosts = mapSheetDataToContent(sheetData, blogStructure);
```

### 4. Image URL Processing

```javascript
// Handle both local and external image URLs
function processImageUrl(rawUrl, baseUrl = '') {
  if (!rawUrl) return '';
  
  // Extract URL from BBCode format if present
  const match = rawUrl.match(/\[img\](.+?)\[\/img\]/i);
  const cleanUrl = match ? match[1].trim() : rawUrl.trim();
  
  // Handle relative vs absolute URLs
  if (cleanUrl.startsWith('http')) {
    return cleanUrl;
  } else {
    return `${baseUrl}${cleanUrl.replace(/^\//, '')}`;
  }
}
```

### 5. Routing with React Router

```javascript
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/works" element={<Works />} />
      <Route path="/work/:id" element={<WorkDetail />} />
      <Route path="/blog" element={<Blog />} />
    </Routes>
  );
}
```

## Google Sheets Setup

### 1. Create Google Sheet Structure

Create a Google Sheet with multiple tabs for different content types:

- **Blog**: Date | Title | Description | Image URL
- **Works**: Title | Date | Description | Type | Image URLs | External Link
- **Commercial**: Image URL | Alt Text | Description
- **Music**: Project Name | Bandcamp URL | SoundCloud URL | Description

### 2. Configure Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create API credentials (API Key)
5. Set up proper security restrictions

### 3. Share Sheet for Public Access

```javascript
// Make sheet publicly readable
// In Google Sheets: Share → Anyone with the link → Viewer
```

## Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Configure for custom domain
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable for production
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

## Environment Variables

```javascript
// .env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_SPREADSHEET_ID=your_spreadsheet_id_here
VITE_BASE_URL=https://yourdomain.com
```

## Content Management Workflow

### 1. For Content Creators

1. **Add Content**: Edit Google Sheet directly
2. **Upload Images**: Use Google Drive for image hosting
3. **Get Image URLs**: Use Google Drive direct links
4. **Preview**: Refresh website to see changes

### 2. Image Management

```javascript
// Google Drive image URL format
const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

// Process image URLs in components
function ImageComponent({ src, alt }) {
  const processedSrc = processImageUrl(src, import.meta.env.BASE_URL);
  return <img src={processedSrc} alt={alt} />;
}
```

## Performance Optimizations

### 1. Caching Strategy

```javascript
// Implement client-side caching
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function useCachedSheetData(spreadsheetId, range, apiKey) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cacheKey = `${spreadsheetId}-${range}`;
    const cached = localStorage.getItem(cacheKey);
    const cachedData = cached ? JSON.parse(cached) : null;

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      setData(cachedData.data);
      setLoading(false);
      return;
    }

    // Fetch fresh data
    fetchSheetData(spreadsheetId, range, apiKey)
      .then(freshData => {
        setData(freshData);
        localStorage.setItem(cacheKey, JSON.stringify({
          data: freshData,
          timestamp: Date.now()
        }));
      })
      .finally(() => setLoading(false));
  }, [spreadsheetId, range, apiKey]);

  return { data, loading };
}
```

### 2. Lazy Loading

```javascript
// Lazy load components
const WorkDetail = lazy(() => import('./pages/WorkDetail'));
const Blog = lazy(() => import('./pages/Blog'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <WorkDetail />
</Suspense>
```

## Deployment Strategy

### 1. Build Process

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

### 2. Static Hosting

Deploy the `dist` folder to:
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Static site hosting
- **AWS S3 + CloudFront**: Enterprise solution

### 3. Custom Domain Setup

```javascript
// vite.config.js
export default defineConfig({
  base: '/', // For root domain
  // or
  base: '/subdirectory/', // For subdirectory
});
```

## Security Considerations

### 1. API Key Security

```javascript
// Use environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

// Restrict API key to specific domains
// In Google Cloud Console: API Keys → Application restrictions → HTTP referrers
```

### 2. Content Validation

```javascript
// Validate content before rendering
function validateContent(content) {
  return {
    title: content.title?.trim() || '',
    description: content.description?.trim() || '',
    imageUrl: isValidUrl(content.imageUrl) ? content.imageUrl : '',
    date: isValidDate(content.date) ? content.date : '',
  };
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
```

## Error Handling

```javascript
// Comprehensive error handling
function useSheetDataWithErrorHandling(spreadsheetId, range, apiKey) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error.message);
        }
        
        setData(result.values || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching sheet data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [spreadsheetId, range, apiKey]);

  return { data, loading, error };
}
```

## Benefits of This Architecture

### 1. **Cost-Effective**
- No database hosting costs
- Free Google Sheets storage
- Static hosting is inexpensive

### 2. **User-Friendly**
- Non-technical users can manage content
- Familiar spreadsheet interface
- Real-time collaboration

### 3. **Scalable**
- CDN distribution
- No server maintenance
- Automatic scaling

### 4. **Fast**
- Pre-built static files
- Optimized assets
- Global CDN delivery

### 5. **Secure**
- No server-side vulnerabilities
- API key restrictions
- Content validation

## Best Practices

1. **Structure your Google Sheet** with clear column headers
2. **Use consistent naming** for sheets and ranges
3. **Implement proper error handling** for API failures
4. **Cache data** to reduce API calls
5. **Validate content** before rendering
6. **Use environment variables** for sensitive data
7. **Implement loading states** for better UX
8. **Add fallback content** for missing data

## Conclusion

This JAMstack architecture with Vite and Google Sheets provides a powerful, cost-effective solution for content-driven websites. It combines the performance benefits of static sites with the flexibility of a headless CMS, making it ideal for portfolios, blogs, and small business websites.

The key advantages are:
- **Easy content management** for non-technical users
- **Fast performance** with static generation
- **Low maintenance** with no server management
- **Cost-effective** hosting and infrastructure
- **Scalable** architecture for growth

This pattern can be adapted and extended for various use cases while maintaining the core benefits of the JAMstack approach. 
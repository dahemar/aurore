# Aurore - Interactive Web Experience

## Overview
Aurore is an interactive web experience built with React that combines visual storytelling, audio elements, and dynamic content management through Google Sheets integration.

## Features

### 🎵 Audio Player
- **Persistent Audio**: Music continues playing when navigating between pages
- **Multiple Tracks**: Access to various audio files through the song selector
- **State Persistence**: Audio state is saved in localStorage and restored on page reload

### 🎭 Interactive Elements
- **Flies Animation**: Animated flies appear on the index page (click anywhere to activate)
- **Hover Effects**: Text trail effects on hover (desktop only)
- **Draggable Gallery**: Interactive image gallery on page 2 where images can be moved freely
- **Responsive Design**: Mobile-optimized layout with touch-friendly interactions

### 📱 Mobile Experience
- **Touch-Friendly**: Optimized for mobile devices with appropriate touch targets
- **Responsive Layout**: Adaptive design that works on all screen sizes
- **Mobile-Specific Features**: Disabled hover effects, optimized image sizing, and centered content

## Page Structure

### 🏠 Index (Home)
- **Flies Animation**: Click anywhere to activate the animated flies
- **Navigation**: Access to all other pages
- **Audio Integration**: Background music support

### 📖 Page 1: Je m'appelle Aurore Delune
- **Content**: Introduction and personal narrative
- **CMS**: Editable through Google Sheets

### 🗺️ Page 2: Topographie de l'étrange
- **Interactive Gallery**: Draggable images with captions
- **Random Positioning**: Images appear in random positions on each page load
- **CMS**: Editable through Google Sheets (title, image_url, caption, size)

### 🏺 Page 3: Reliques du rêve
- **Content**: Dream relics and mystical elements
- **CMS**: Editable through Google Sheets

### 🌙 Page 4: Mémoires du Mont Songe
- **Poetry**: Structured poetic content with introductory quote
- **CMS**: Editable through Google Sheets (order, content)
- **Content Structure**: 
  - Order 0: Introductory quote (Diamond Sutra)
  - Order 1+: Main poetic content

## Content Management System (CMS)

### Google Sheets Integration
The website uses Google Sheets as a headless CMS, allowing content updates without code changes.

#### Required Environment Variables
```bash
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_SPREADSHEET_ID=your_spreadsheet_id_here
```

#### Sheet Structure
1. **page1_je_mappelle_aurore**: `title, content`
2. **page2_topographie_etrange**: `title, image_url, caption, size`
3. **page3_reliques_reve**: `title, content`
4. **page4_memoires_mont_songe**: `text_type, content`

#### Content Structure Details
- **Page2 (Topographie de l'étrange)**: 
  - `title`: Image identifier
  - `image_url`: Path to image file (relative to images/ folder)
  - `caption`: Text displayed below each image
  - `size`: Image size (`normal` or `big`)

- **Page4 (Mémoires du Mont Songe)**:
  - `text_type`: Either `introductory_quote` or `main_content`
  - `content`: The actual text content
  - `introductory_quote`: The Diamond Sutra quote at the top
  - `main_content`: The main poetic text below

#### Content Update Process
1. Make changes in Google Sheets
2. Ensure the sheet is publicly accessible ("Anyone with the link can view")
3. Changes appear instantly in development mode
4. Production has a 1-minute cache for performance

### CSV Templates
CSV files are provided in the `csv_templates/` directory as reference for the required data structure.

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development
```bash
cd react-app
npm install
npm run dev
```

The development server will start at `http://localhost:5173/aurore/`

### Build for Production
```bash
npm run build
```

### Environment Configuration
Copy `env.example` to `.env` and fill in your Google Sheets API credentials.

## Deployment

### GitHub Pages
The project is configured for GitHub Pages deployment with the base path `/aurore/`.

#### Automatic Deployment
1. Push changes to the main branch
2. GitHub Actions automatically builds and deploys
3. The site is available at `https://yourusername.github.io/aurore/`

#### Manual Deployment
```bash
npm run build
# Upload the dist/ folder contents to GitHub Pages
```

## Technical Architecture

### Frontend Framework
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for SPA experience
- **Vite**: Fast build tool and development server

### Key Components
- **AudioPlayer**: Handles audio playback and state persistence
- **Flies**: Animated flies component with click activation
- **DraggableGallery**: Interactive image gallery with drag functionality
- **useSheetData**: Custom hook for Google Sheets data fetching

### Performance Features
- **Hot Module Replacement**: Instant updates during development
- **Optimized Caching**: Smart caching strategy for Google Sheets data
- **Responsive Images**: Optimized image loading and sizing

## Troubleshooting

### Common Issues

#### Audio Not Playing
- Check browser autoplay policies
- Ensure audio files are accessible
- Verify localStorage is enabled

#### Images Not Loading
- Check image URLs in Google Sheets
- Verify image file accessibility
- Ensure proper file permissions

#### CMS Not Updating
- Verify Google Sheets API key
- Check spreadsheet permissions (must be public)
- Clear browser cache if needed

#### Mobile Layout Issues
- Test on actual mobile devices
- Check viewport meta tags
- Verify CSS media queries

### Development Tips
- Use browser dev tools to debug issues
- Check console for error messages
- Test on multiple devices and browsers
- Monitor network requests for API calls

## Contributing

### Code Style
- Use functional components with hooks
- Follow React best practices
- Maintain responsive design principles
- Test on multiple devices

### Adding New Features
1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Submit pull request

## License
This project is proprietary and confidential.

## Support
For technical support or questions about the CMS integration, refer to the development team or check the project documentation. 
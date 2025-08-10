// Google Sheets API integration for content management
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/'

// Fetch data from Google Sheets
export async function fetchSheetData(range) {
  try {
    const url = `${BASE_URL}${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Error fetching data')
    const data = await response.json()
    return data.values || []
  } catch (error) {
    console.error('Error fetching sheet data:', error)
    return []
  }
}

// Process image URLs from Google Drive or local paths
export function processImageUrl(rawUrl, baseUrl = '') {
  if (!rawUrl) return ''
  
  // Extract URL from BBCode format if present
  const match = rawUrl.match(/\[img\](.+?)\[\/img\]/i)
  const cleanUrl = match ? match[1].trim() : rawUrl.trim()
  
  // Handle relative vs absolute URLs
  if (cleanUrl.startsWith('http')) {
    return cleanUrl
  } else {
    return `${baseUrl}${cleanUrl.replace(/^\//, '')}`
  }
}

// Map raw sheet data to structured content
export function mapSheetDataToContent(rawData, contentStructure) {
  return rawData.map(row => {
    const content = {}
    contentStructure.forEach((field, index) => {
      content[field] = row[index] || ''
    })
    return content
  })
}

// Cache data to reduce API calls
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useCachedSheetData(spreadsheetId, range, apiKey) {
  const cacheKey = `${spreadsheetId}-${range}`
  const cached = localStorage.getItem(cacheKey)
  const cachedData = cached ? JSON.parse(cached) : null

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data
  }

  return null
}

export function setCachedSheetData(spreadsheetId, range, data) {
  const cacheKey = `${spreadsheetId}-${range}`
  localStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now()
  }))
} 
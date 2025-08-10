import { useState, useEffect } from 'react'
import { fetchSheetData, useCachedSheetData, setCachedSheetData } from '../utils/sheetsApi'

export function useSheetData(range, contentStructure = null) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        // Check cache first
        const cachedData = useCachedSheetData(import.meta.env.VITE_SPREADSHEET_ID, range)
        if (cachedData) {
          setData(cachedData)
          setLoading(false)
          return
        }
        
        // Fetch fresh data
        const rawData = await fetchSheetData(range)
        
        if (contentStructure) {
          const processedData = contentStructure.map((field, index) => {
            const content = {}
            contentStructure.forEach((field, index) => {
              content[field] = rawData[index] || ''
            })
            return content
          })
          setData(processedData)
          setCachedSheetData(import.meta.env.VITE_SPREADSHEET_ID, range, processedData)
        } else {
          setData(rawData)
          setCachedSheetData(import.meta.env.VITE_SPREADSHEET_ID, range, rawData)
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching sheet data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [range, contentStructure])

  return { data, loading, error }
} 
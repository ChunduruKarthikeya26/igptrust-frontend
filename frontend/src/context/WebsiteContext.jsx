import { createContext, useContext, useState, useEffect } from 'react'
import { getWebsites } from '../api/websites'
import { useAuth } from './AuthContext'

const WebsiteContext = createContext(null)

export function WebsiteProvider({ children }) {
  const [websites, setWebsites] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(true)
  const { business } = useAuth()

  useEffect(() => {
    if (!business) {
      setWebsites([])
      setSelectedId('')
      setLoading(false)
      return
    }

    setLoading(true)
    getWebsites()
      .then(r => {
        const list = Array.isArray(r.data) ? r.data : (Array.isArray(r) ? r : [])
        setWebsites(list)
        if (list.length > 0) {
  const saved = localStorage.getItem('selectedWebsiteId')
  const exists = list.find(w => w.id === saved)
  // If no valid saved selection, default to '' (All Websites) not the first site
  const id = exists ? saved : ''
  setSelectedId(id)
  if (id) localStorage.setItem('selectedWebsiteId', id)
  else localStorage.removeItem('selectedWebsiteId')
}
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [business])

  const selectWebsite = (id) => {
    setSelectedId(id)
    localStorage.setItem('selectedWebsiteId', id)
  }

  const selectedWebsite = (Array.isArray(websites) ? websites : []).find(w => w.id === selectedId) || null

  return (
    <WebsiteContext.Provider value={{ websites, selectedId, selectedWebsite, selectWebsite, loading }}>
      {children}
    </WebsiteContext.Provider>
  )
}

export function useWebsite() {
  return useContext(WebsiteContext)
}
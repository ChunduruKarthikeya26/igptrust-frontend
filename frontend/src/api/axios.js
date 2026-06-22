import axios from 'axios'
import mockAdapter from './mockAdapter'

const api = axios.create({
  baseURL: window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : '/api',
  headers: { 
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
})

// Enable client-side mock adapter if not running on localhost,
// or if manually forced via localStorage.
const useMock = window.location.hostname !== 'localhost' || localStorage.getItem('use_mock_backend') === 'true'

if (useMock) {
  api.defaults.adapter = mockAdapter
}

api.interceptors.request.use((config) => {
  const url = config.url || ''
  const isPortalRoute = url.startsWith('/portal') || url.includes('/portal/')

  // Never send admin auth token on public portal routes
  if (!isPortalRoute) {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || ''
      const isAuthRoute = url.includes('/auth/')
      const isPublicRoute =
        url.includes('/consents') && !url.includes('/stats') && !url.includes('/export')
      const isPortalRoute =
        url.startsWith('/portal') || url.includes('/portal/')

      // Never redirect portal users to /login
      if (
        !isAuthRoute &&
        !isPublicRoute &&
        !isPortalRoute &&
        window.location.pathname !== '/login' &&
        !window.location.pathname.startsWith('/portal')
      ) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
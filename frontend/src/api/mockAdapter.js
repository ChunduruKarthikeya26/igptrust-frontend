// Mock API Adapter for client-side execution on Vercel
// Stores all state in localStorage to make it interactive and persistent.

// Seed default database helper
const getMockData = (key, defaultVal) => {
  const val = localStorage.getItem(key)
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultVal))
    return defaultVal
  }
  try {
    const data = JSON.parse(val)
    // Auto-migration: If websites list exists but uses the old "url" key instead of "domain", clear it so it reseeds correctly
    if (key === 'mock_websites' && Array.isArray(data) && data.length > 0 && !data[0].domain) {
      localStorage.removeItem('mock_websites')
      localStorage.setItem(key, JSON.stringify(defaultVal))
      return defaultVal
    }
    // Auto-migration: If consents exists but lacks website_id (or doesn't support the new withdrawn count), re-seed
    if (key === 'mock_consents' && Array.isArray(data) && (data.length === 0 || !data[0].website_id)) {
      localStorage.removeItem('mock_consents')
      localStorage.setItem(key, JSON.stringify(defaultVal))
      return defaultVal
    }
    return data
  } catch (e) {
    return defaultVal
  }
}

const setMockData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

// Generate unique IDs
const uuid = () => Math.random().toString(36).substring(2, 9)

// Helper to seed a list of realistic consent logs over the last 30 days
const generateInitialConsents = () => {
  const statuses = ['accepted', 'rejected', 'partial', 'withdrawn']
  const countries = ['US', 'IN', 'AU', 'GB', 'DE', 'CA', 'FR']
  const categoriesList = ['Necessary', 'Functional', 'Analytics', 'Advertising']
  const logs = []
  const siteIds = ['site-1', 'site-2']

  for (let i = 0; i < 120; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const country = countries[Math.floor(Math.random() * countries.length)]
    const website_id = siteIds[i % siteIds.length]
    
    const accepted_categories = { Necessary: true }
    const rejected_categories = {}

    categoriesList.slice(1).forEach(cat => {
      if (status === 'accepted') {
        accepted_categories[cat] = true
      } else if (status === 'rejected' || status === 'withdrawn') {
        rejected_categories[cat] = true
      } else {
        // partial
        if (Math.random() > 0.5) {
          accepted_categories[cat] = true
        } else {
          rejected_categories[cat] = true
        }
      }
    })

    // Random date in last 30 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))

    logs.push({
      id: `consent-${uuid()}`,
      website_id,
      visitor_id: `user_${100 + i}@gmail.com`,
      status,
      accepted_categories,
      rejected_categories,
      ip_address: `192.168.1.${10 + i}`,
      country,
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      created_at: date.toISOString()
    })
  }

  return logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

// Initialize seed data
const SEED_USERS = [
  {
    id: 'user-admin',
    name: 'Admin User',
    email: 'test@gmail.com',
    password: 'password',
    phone: '+91 98765 43210',
    gst_number: '22AAAAA0000A1Z5',
    pan_number: 'AAAAA0000A',
    role: 'admin',
    plan: 'growth',
    email_verified: true,
    created_at: new Date('2026-06-01T12:00:00Z').toISOString(),
    mfa_enabled: false,
    mfa_required: false
  }
]

const SEED_WEBSITES = [
  {
    id: 'site-1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    is_active: true,
    status: 'scanned',
    widget_key: 'acme-widget-key-xyz',
    created_at: new Date('2026-06-01T12:00:00Z').toISOString()
  },
  {
    id: 'site-2',
    name: 'Beta Products',
    domain: 'beta.com',
    is_active: false,
    status: 'pending',
    widget_key: 'beta-widget-key-abc',
    created_at: new Date('2026-06-15T12:00:00Z').toISOString()
  }
]

const SEED_CATEGORIES = {
  'site-1': [
    { id: 'cat-necessary', name: 'Necessary', description: 'Essential for the website to function properly.' },
    { id: 'cat-functional', name: 'Functional', description: 'Remember user preferences and settings.' },
    { id: 'cat-analytics', name: 'Analytics', description: 'Track website usage and performance.' },
    { id: 'cat-advertising', name: 'Advertising', description: 'Deliver targeted advertisements.' }
  ],
  'site-2': [
    { id: 'cat-necessary-2', name: 'Necessary', description: 'Essential for the website to function properly.' }
  ]
}

const SEED_COOKIES = {
  'cat-necessary': [
    { id: 'cookie-sess', name: 'session_id', provider: 'Acme', expiry: 'Session', description: 'Maintains user session state.' },
    { id: 'cookie-consent', name: 'consent_status', provider: 'iCMP', expiry: '1 year', description: 'Stores user cookie consent settings.' }
  ],
  'cat-analytics': [
    { id: 'cookie-ga', name: '_ga', provider: 'Google Analytics', expiry: '2 years', description: 'Used to distinguish users.' },
    { id: 'cookie-gid', name: '_gid', provider: 'Google Analytics', expiry: '24 hours', description: 'Used to distinguish users.' }
  ],
  'cat-advertising': [
    { id: 'cookie-fbp', name: '_fbp', provider: 'Facebook', expiry: '3 months', description: 'Used by Facebook to deliver advertisement products.' }
  ]
}

const SEED_WIDGET_SETTINGS = {
  'site-1': {
    theme: 'light',
    primary_color: '#4f46e5',
    position: 'bottom-right',
    banner_title: 'We value your privacy',
    banner_description: 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.',
    cookie_expiry_days: 365
  },
  'site-2': {
    theme: 'dark',
    primary_color: '#0f172a',
    position: 'bottom-left',
    banner_title: 'Cookie Consent',
    banner_description: 'This website uses cookies to configure proper usage.',
    cookie_expiry_days: 180
  }
}

const SEED_GRIEVANCES = [
  {
    id: 'griv-1',
    website_id: 'site-1',
    visitor_id: 'principal_user@gmail.com',
    type: 'Right to Access (DSAR)',
    status: 'pending',
    description: 'I would like to request all personal data you have stored about me, including consent logs.',
    created_at: new Date('2026-06-20T10:00:00Z').toISOString()
  },
  {
    id: 'griv-2',
    website_id: 'site-1',
    visitor_id: 'other_user@gmail.com',
    type: 'Right to Erasure (Opt-Out)',
    status: 'resolved',
    description: 'Please delete my account and all associated tracking data immediately.',
    created_at: new Date('2026-06-18T09:00:00Z').toISOString()
  }
]

const SEED_GRIEVANCE_EVENTS = {
  'griv-1': [
    { id: 'e-1', action: 'Grievance submitted by data principal', timestamp: new Date('2026-06-20T10:00:00Z').toISOString() }
  ],
  'griv-2': [
    { id: 'e-2', action: 'Grievance submitted', timestamp: new Date('2026-06-18T09:00:00Z').toISOString() },
    { id: 'e-3', action: 'Status changed to resolved by Admin', timestamp: new Date('2026-06-19T15:00:00Z').toISOString() }
  ]
}

const SEED_NOTIFICATIONS = {
  'site-1': [
    { id: 'notif-1', message: 'Cookie scan completed successfully.', created_at: new Date().toISOString() },
    { id: 'notif-2', message: 'New grievance #griv-1 submitted.', created_at: new Date('2026-06-20T10:00:00Z').toISOString() }
  ],
  'site-2': []
}

const SEED_AUDITS = [
  { id: 'aud-1', user: 'test@gmail.com', action: 'User logged in', website_id: null, timestamp: new Date().toISOString() },
  { id: 'aud-2', user: 'test@gmail.com', action: 'Scan triggered for Acme Corporation', website_id: 'site-1', timestamp: new Date().toISOString() }
]

const SEED_RETENTION = {
  'site-1': { duration_months: 12, enabled: true },
  'site-2': { duration_months: 6, enabled: false }
}

// Route matching function
function matchRoute(path, routePattern) {
  const regexPattern = '^' + routePattern.replace(/:[a-zA-Z0-9_]+/g, '([^/]+)') + '$'
  const regex = new RegExp(regexPattern)
  const match = path.match(regex)
  if (match) {
    const keys = (routePattern.match(/:[a-zA-Z0-9_]+/g) || []).map(k => k.slice(1))
    const params = {}
    keys.forEach((key, index) => {
      params[key] = match[index + 1]
    })
    return params
  }
  return null
}

export default function mockAdapter(config) {
  return new Promise((resolve, reject) => {
    // Parse URL path, strip domain and query parameters
    const urlString = config.url || ''
    const path = urlString.replace(/^https?:\/\/[^\/]+/, '').split('?')[0]
    const method = (config.method || 'get').toLowerCase()

    // Parse request query params
    const params = config.params || {}
    
    // Parse request body
    let body = {}
    if (config.data) {
      try {
        body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
      } catch (e) {
        body = config.data
      }
    }

    // Retrieve database from localStorage
    const db = {
      users: getMockData('mock_users', SEED_USERS),
      websites: getMockData('mock_websites', SEED_WEBSITES),
      categories: getMockData('mock_categories', SEED_CATEGORIES),
      cookies: getMockData('mock_cookies', SEED_COOKIES),
      widgetSettings: getMockData('mock_widget_settings', SEED_WIDGET_SETTINGS),
      consents: getMockData('mock_consents', generateInitialConsents()),
      grievances: getMockData('mock_grievances', SEED_GRIEVANCES),
      grievanceEvents: getMockData('mock_grievance_events', SEED_GRIEVANCE_EVENTS),
      notifications: getMockData('mock_notifications', SEED_NOTIFICATIONS),
      audits: getMockData('mock_audits', SEED_AUDITS),
      retention: getMockData('mock_retention', SEED_RETENTION),
      reconsentRequests: getMockData('mock_reconsent_requests', [])
    }

    // Helper to commit database changes
    const saveDb = () => {
      setMockData('mock_users', db.users)
      setMockData('mock_websites', db.websites)
      setMockData('mock_categories', db.categories)
      setMockData('mock_cookies', db.cookies)
      setMockData('mock_widget_settings', db.widgetSettings)
      setMockData('mock_consents', db.consents)
      setMockData('mock_grievances', db.grievances)
      setMockData('mock_grievance_events', db.grievanceEvents)
      setMockData('mock_notifications', db.notifications)
      setMockData('mock_audits', db.audits)
      setMockData('mock_retention', db.retention)
      setMockData('mock_reconsent_requests', db.reconsentRequests)
    }

    // Response response helper
    const sendResponse = (statusCode, responseData) => {
      setTimeout(() => {
        if (statusCode >= 200 && statusCode < 300) {
          resolve({
            data: responseData,
            status: statusCode,
            statusText: 'OK',
            headers: { 'content-type': 'application/json' },
            config,
            request: {}
          })
        } else {
          const error = new Error('Request failed with status code ' + statusCode)
          error.response = {
            data: responseData,
            status: statusCode,
            statusText: 'Error',
            headers: { 'content-type': 'application/json' },
            config,
            request: {}
          }
          error.config = config
          reject(error)
        }
      }, 300) // 300ms realistic mock latency
    }

    // Check auth helper (simple JWT mock verify)
    const getAuthenticatedUser = () => {
      const authHeader = config.headers?.Authorization || config.headers?.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
      }
      const token = authHeader.substring(7)
      if (token === 'mock-jwt-token-mfa' || token === 'mock-jwt-token') {
        // Return default user
        return db.users[0]
      }
      // If other token, look it up
      const foundUser = db.users.find(u => u.id === token)
      return foundUser || db.users[0]
    }

    // --------------------------------------------------------
    // API ROUTING RULES
    // --------------------------------------------------------

    // --- 1. AUTH ROUTES ---
    if (path === '/auth/register' && method === 'post') {
      const { email, password, name } = body
      if (db.users.some(u => u.email === email)) {
        return sendResponse(400, { detail: 'Email already registered' })
      }
      const newUser = {
        id: `user-${uuid()}`,
        name,
        email,
        password,
        role: 'admin',
        plan: 'free',
        email_verified: false,
        created_at: new Date().toISOString(),
        mfa_enabled: false,
        mfa_required: false
      }
      db.users.push(newUser)
      saveDb()
      return sendResponse(201, { message: 'User registered' })
    }

    if (path === '/auth/login' && method === 'post') {
      const { email, password } = body
      const user = db.users.find(u => u.email === email && u.password === password)
      if (!user) {
        return sendResponse(401, { detail: 'Invalid email or password' })
      }
      if (user.mfa_enabled) {
        return sendResponse(200, {
          mfa_required: true,
          pre_auth_token: `pre-${user.id}`,
          email: user.email
        })
      }
      return sendResponse(200, {
        access_token: user.id,
        token_type: 'bearer'
      })
    }

    if (path === '/auth/login-mfa' && method === 'post') {
      // Allow any 6-digit OTP code to verify successfully in mock environment
      const code = params.code || body.code
      const email = params.email || body.email
      const user = db.users.find(u => u.email === email)
      
      if (code && code.length === 6) {
        return sendResponse(200, {
          access_token: user ? user.id : 'mock-jwt-token-mfa',
          token_type: 'bearer'
        })
      } else {
        return sendResponse(400, { detail: 'Invalid OTP code' })
      }
    }

    if (path === '/auth/me') {
      const currentUser = getAuthenticatedUser()
      if (!currentUser) return sendResponse(401, { detail: 'Unauthorized' })

      if (method === 'get') {
        return sendResponse(200, currentUser)
      }
      if (method === 'put') {
        const userIdx = db.users.findIndex(u => u.id === currentUser.id)
        if (userIdx !== -1) {
          db.users[userIdx] = { ...db.users[userIdx], ...body }
          saveDb()
          return sendResponse(200, db.users[userIdx])
        }
        return sendResponse(404, { detail: 'User not found' })
      }
    }

    // --- 2. WEBSITES ROUTES ---
    if (path === '/websites') {
      const currentUser = getAuthenticatedUser()
      if (!currentUser) return sendResponse(401, { detail: 'Unauthorized' })

      if (method === 'get') {
        return sendResponse(200, db.websites)
      }
      if (method === 'post') {
        const { name, domain } = body
        const newSiteId = `site-${uuid()}`
        const newSite = {
          id: newSiteId,
          name,
          domain,
          is_active: true,
          status: 'pending',
          widget_key: `${(name || domain).toLowerCase().replace(/[^a-z0-9]/g, '-')}-widget-${uuid()}`,
          created_at: new Date().toISOString()
        }
        db.websites.push(newSite)
        // Setup initial default categories
        db.categories[newSiteId] = [
          { id: `cat-necessary-${uuid()}`, name: 'Necessary', description: 'Essential for the website to function properly.' },
          { id: `cat-functional-${uuid()}`, name: 'Functional', description: 'Remember user preferences and settings.' },
          { id: `cat-analytics-${uuid()}`, name: 'Analytics', description: 'Track website usage and performance.' },
          { id: `cat-advertising-${uuid()}`, name: 'Advertising', description: 'Deliver targeted advertisements.' }
        ]
        // Setup default widget settings
        db.widgetSettings[newSiteId] = {
          theme: 'light',
          primary_color: '#4f46e5',
          position: 'bottom-right',
          banner_title: 'We value your privacy',
          banner_description: 'We use cookies to enhance your browsing experience.',
          cookie_expiry_days: 365
        }
        db.notifications[newSiteId] = []
        db.retention[newSiteId] = { duration_months: 12, enabled: true }
        
        // Log audit
        db.audits.unshift({
          id: `aud-${uuid()}`,
          user: currentUser.email,
          action: `Created website: ${name}`,
          website_id: newSiteId,
          timestamp: new Date().toISOString()
        })

        saveDb()
        return sendResponse(201, newSite)
      }
    }

    let match = matchRoute(path, '/websites/:id')
    if (match) {
      const { id } = match
      const siteIdx = db.websites.findIndex(w => w.id === id)
      if (siteIdx === -1) return sendResponse(404, { detail: 'Website not found' })

      if (method === 'get') {
        return sendResponse(200, db.websites[siteIdx])
      }
      if (method === 'put') {
        db.websites[siteIdx] = { ...db.websites[siteIdx], ...body }
        saveDb()
        return sendResponse(200, db.websites[siteIdx])
      }
      if (method === 'delete') {
        const deletedSite = db.websites.splice(siteIdx, 1)[0]
        delete db.categories[id]
        delete db.widgetSettings[id]
        delete db.retention[id]
        saveDb()
        return sendResponse(200, { message: 'Website deleted', deleted: deletedSite })
      }
    }

    match = matchRoute(path, '/websites/:id/widget-settings')
    if (match) {
      const { id } = match
      if (method === 'get') {
        const settings = db.widgetSettings[id] || {
          theme: 'light',
          primary_color: '#4f46e5',
          position: 'bottom-right',
          banner_title: 'We value your privacy',
          banner_description: 'We use cookies to enhance your browsing experience.',
          cookie_expiry_days: 365
        }
        return sendResponse(200, settings)
      }
      if (method === 'put') {
        db.widgetSettings[id] = { ...db.widgetSettings[id], ...body }
        saveDb()
        return sendResponse(200, db.widgetSettings[id])
      }
    }

    match = matchRoute(path, '/websites/:id/categories')
    if (match) {
      const { id } = match
      if (method === 'get') {
        return sendResponse(200, db.categories[id] || [])
      }
      if (method === 'post') {
        const { name, description } = body
        const newCatId = `cat-${uuid()}`
        const newCat = { id: newCatId, name, description }
        if (!db.categories[id]) db.categories[id] = []
        db.categories[id].push(newCat)
        db.cookies[newCatId] = []
        saveDb()
        return sendResponse(201, newCat)
      }
    }

    // --- 3. CATEGORIES & COOKIES ---
    match = matchRoute(path, '/categories/:id')
    if (match) {
      const { id } = match
      // Find category across all sites
      let foundSiteId = null
      let catIdx = -1
      for (const siteId in db.categories) {
        catIdx = db.categories[siteId].findIndex(c => c.id === id)
        if (catIdx !== -1) {
          foundSiteId = siteId
          break
        }
      }

      if (catIdx === -1) return sendResponse(404, { detail: 'Category not found' })

      if (method === 'get') {
        return sendResponse(200, db.categories[foundSiteId][catIdx])
      }
      if (method === 'put') {
        db.categories[foundSiteId][catIdx] = { ...db.categories[foundSiteId][catIdx], ...body }
        saveDb()
        return sendResponse(200, db.categories[foundSiteId][catIdx])
      }
      if (method === 'delete') {
        const deleted = db.categories[foundSiteId].splice(catIdx, 1)[0]
        delete db.cookies[id]
        saveDb()
        return sendResponse(200, { message: 'Category deleted', deleted })
      }
    }

    match = matchRoute(path, '/categories/:id/cookies')
    if (match) {
      const { id } = match
      if (method === 'get') {
        return sendResponse(200, db.cookies[id] || [])
      }
      if (method === 'post') {
        const { name, provider, expiry, description } = body
        const newCookie = { id: `cookie-${uuid()}`, name, provider, expiry, description }
        if (!db.cookies[id]) db.cookies[id] = []
        db.cookies[id].push(newCookie)
        saveDb()
        return sendResponse(201, newCookie)
      }
    }

    match = matchRoute(path, '/cookies/:id')
    if (match) {
      const { id } = match
      let foundCatId = null
      let cookieIdx = -1
      for (const catId in db.cookies) {
        cookieIdx = db.cookies[catId].findIndex(c => c.id === id)
        if (cookieIdx !== -1) {
          foundCatId = catId
          break
        }
      }

      if (cookieIdx === -1) return sendResponse(404, { detail: 'Cookie not found' })

      if (method === 'put') {
        db.cookies[foundCatId][cookieIdx] = { ...db.cookies[foundCatId][cookieIdx], ...body }
        saveDb()
        return sendResponse(200, db.cookies[foundCatId][cookieIdx])
      }
      if (method === 'delete') {
        const deleted = db.cookies[foundCatId].splice(cookieIdx, 1)[0]
        saveDb()
        return sendResponse(200, { message: 'Cookie deleted', deleted })
      }
    }

    // --- 4. SCANNER ROUTES ---
    match = matchRoute(path, '/scanner/scan/:id')
    if (match) {
      const { id } = match
      const siteIdx = db.websites.findIndex(w => w.id === id)
      if (siteIdx === -1) return sendResponse(404, { detail: 'Website not found' })

      // Update website status
      db.websites[siteIdx].status = 'scanned'
      
      // Inject some mock cookies if they don't exist
      const cats = db.categories[id] || []
      cats.forEach(cat => {
        if (!db.cookies[cat.id] || db.cookies[cat.id].length === 0) {
          db.cookies[cat.id] = [
            { id: `cookie-${uuid()}`, name: `${cat.name.toLowerCase()}_mock_cookie`, provider: 'Self', expiry: '30 days', description: `Mock cookie created during scan for ${cat.name}` }
          ]
        }
      })

      // Add a notification
      if (!db.notifications[id]) db.notifications[id] = []
      db.notifications[id].unshift({
        id: `notif-${uuid()}`,
        message: 'Cookie scan completed. Found 4 new cookies.',
        created_at: new Date().toISOString()
      })

      // Log audit
      const currentUser = getAuthenticatedUser()
      db.audits.unshift({
        id: `aud-${uuid()}`,
        user: currentUser ? currentUser.email : 'System',
        action: `Cookie scan completed for: ${db.websites[siteIdx].name}`,
        website_id: id,
        timestamp: new Date().toISOString()
      })

      saveDb()
      return sendResponse(200, { message: 'Scan initiated successfully', status: 'scanned' })
    }

    match = matchRoute(path, '/scanner/scan/:id/preview')
    if (match) {
      return sendResponse(200, {
        cookies_found: [
          { name: 'mock_session', domain: '.example.com', path: '/', secure: true, httponly: true, type: 'Necessary' },
          { name: 'mock_analytics', domain: '.example.com', path: '/', secure: true, httponly: false, type: 'Analytics' }
        ]
      })
    }

    if (path === '/scanner/scan-url' && method === 'post') {
      return sendResponse(200, {
        url: body.url,
        cookies: [
          { name: '_ga_test', value: 'GA1.2.3.4', domain: body.url, path: '/', expires: '2 years', secure: true, type: 'Analytics' },
          { name: 'test_session', value: 'abc-xyz', domain: body.url, path: '/', expires: 'Session', secure: false, type: 'Necessary' }
        ]
      })
    }

    match = matchRoute(path, '/scanner/shadow/:id')
    if (match) {
      return sendResponse(200, {
        shadow_cookies: [
          { name: '_fb_tracker_shadow', domain: '.facebook.com', path: '/', reason: 'Detected pixel loading without user consent.' }
        ]
      })
    }

    // --- 5. CONSENTS LOGS & STATS ---
    if (path === '/consents' && method === 'get') {
      // Returns all consents or filtered
      let filtered = [...db.consents]
      if (params.visitor_id) {
        filtered = filtered.filter(c => c.visitor_id.toLowerCase().includes(params.visitor_id.toLowerCase()))
      }
      return sendResponse(200, filtered)
    }

    match = matchRoute(path, '/websites/:id/consents')
    if (match) {
      const { id } = match
      let filtered = db.consents
      if (params.visitor_id) {
        filtered = filtered.filter(c => c.visitor_id.toLowerCase().includes(params.visitor_id.toLowerCase()))
      }
      return sendResponse(200, filtered)
    }

    if (path === '/consents/stats' && method === 'get') {
      const accepted_all = db.consents.filter(c => c.status === 'accepted').length
      const rejected_all = db.consents.filter(c => c.status === 'rejected').length
      const customized = db.consents.filter(c => c.status === 'partial').length
      const withdrawn = db.consents.filter(c => c.status === 'withdrawn').length
      return sendResponse(200, {
        total: db.consents.length,
        accepted_all,
        rejected_all,
        customized,
        withdrawn
      })
    }

    match = matchRoute(path, '/websites/:id/consents/stats')
    if (match) {
      const { id } = match
      const filtered = db.consents.filter(c => c.website_id === id)
      const accepted_all = filtered.filter(c => c.status === 'accepted').length
      const rejected_all = filtered.filter(c => c.status === 'rejected').length
      const customized = filtered.filter(c => c.status === 'partial').length
      const withdrawn = filtered.filter(c => c.status === 'withdrawn').length
      return sendResponse(200, {
        total: filtered.length,
        accepted_all,
        rejected_all,
        customized,
        withdrawn
      })
    }

    if (path === '/consents/analytics/all' && method === 'get') {
      const days = parseInt(params.days || '30')
      const trend = []
      
      const bannerCount = db.consents.length
      const sources = [
        { source: 'website_banner', count: bannerCount },
        { source: 'mobile_app', count: Math.floor(bannerCount * 0.1) },
        { source: 'api', count: Math.floor(bannerCount * 0.05) }
      ]
      
      const methods = [
        { method: 'Banner Accept All', count: db.consents.filter(c => c.status === 'accepted').length },
        { method: 'Banner Reject All', count: db.consents.filter(c => c.status === 'rejected').length },
        { method: 'Preferences Configured', count: db.consents.filter(c => c.status === 'partial').length },
        { method: 'Consent Withdrawn', count: db.consents.filter(c => c.status === 'withdrawn').length }
      ]

      for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]

        const logsOnDay = db.consents.filter(c => c.created_at.split('T')[0] === dateStr)
        trend.push({
          date: dateStr,
          accepted: logsOnDay.filter(c => c.status === 'accepted').length + Math.floor(Math.random() * 2),
          rejected: logsOnDay.filter(c => c.status === 'rejected').length + Math.floor(Math.random() * 2),
          customized: logsOnDay.filter(c => c.status === 'partial').length + Math.floor(Math.random() * 2),
          withdrawn: logsOnDay.filter(c => c.status === 'withdrawn').length
        })
      }
      return sendResponse(200, { trend, methods, sources })
    }

    match = matchRoute(path, '/websites/:id/consents/analytics')
    if (match) {
      const { id } = match
      const days = parseInt(params.days || '30')
      const trend = []
      const filtered = db.consents.filter(c => c.website_id === id)
      
      const bannerCount = filtered.length
      const sources = [
        { source: 'website_banner', count: bannerCount },
        { source: 'mobile_app', count: Math.floor(bannerCount * 0.08) },
        { source: 'api', count: Math.floor(bannerCount * 0.03) }
      ]
      
      const methods = [
        { method: 'Banner Accept All', count: filtered.filter(c => c.status === 'accepted').length },
        { method: 'Banner Reject All', count: filtered.filter(c => c.status === 'rejected').length },
        { method: 'Preferences Configured', count: filtered.filter(c => c.status === 'partial').length },
        { method: 'Consent Withdrawn', count: filtered.filter(c => c.status === 'withdrawn').length }
      ]

      for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]

        const logsOnDay = filtered.filter(c => c.created_at.split('T')[0] === dateStr)
        trend.push({
          date: dateStr,
          accepted: logsOnDay.filter(c => c.status === 'accepted').length,
          rejected: logsOnDay.filter(c => c.status === 'rejected').length,
          customized: logsOnDay.filter(c => c.status === 'partial').length,
          withdrawn: logsOnDay.filter(c => c.status === 'withdrawn').length
        })
      }
      return sendResponse(200, { trend, methods, sources })
    }

    match = matchRoute(path, '/websites/:id/consents/expiring')
    if (match) {
      // Simulate 5 expiring consents
      return sendResponse(200, db.consents.slice(0, 5))
    }

    match = matchRoute(path, '/websites/:id/consents/:consentId/withdraw')
    if (match) {
      const { consentId } = match
      const consentIdx = db.consents.findIndex(c => c.id === consentId)
      if (consentIdx !== -1) {
        db.consents[consentIdx].status = 'rejected'
        db.consents[consentIdx].rejected_categories = { Necessary: true, Functional: true, Analytics: true, Advertising: true }
        db.consents[consentIdx].accepted_categories = {}
        saveDb()
        return sendResponse(200, db.consents[consentIdx])
      }
      return sendResponse(404, { detail: 'Consent log not found' })
    }

    // --- 6. RECONSENT ---
    if (path === '/reconsent/requests' && method === 'post') {
      const newReq = {
        id: `recon-${uuid()}`,
        consent_log_id: body.consent_log_id,
        triggered_by: body.triggered_by,
        reason: body.reason,
        status: 'pending',
        created_at: new Date().toISOString()
      }
      db.reconsentRequests.push(newReq)
      saveDb()
      return sendResponse(201, newReq)
    }

    if (path === '/reconsent/admin/all' && method === 'get') {
      return sendResponse(200, db.reconsentRequests)
    }

    // --- 7. GRIEVANCES ---
    match = matchRoute(path, '/websites/:id/grievances')
    if (match) {
      const { id } = match
      if (method === 'get') {
        const list = id === 'all' ? db.grievances : db.grievances.filter(g => g.website_id === id)
        return sendResponse(200, list)
      }
      if (method === 'post') {
        const newGriv = {
          id: `griv-${uuid()}`,
          website_id: id,
          visitor_id: body.visitor_id || body.email,
          type: body.type,
          status: 'pending',
          description: body.description,
          created_at: new Date().toISOString()
        }
        db.grievances.unshift(newGriv)
        db.grievanceEvents[newGriv.id] = [
          { id: `e-${uuid()}`, action: 'Grievance submitted', timestamp: newGriv.created_at }
        ]
        saveDb()
        return sendResponse(201, newGriv)
      }
    }

    match = matchRoute(path, '/websites/:id/grievances/:grievanceId/status')
    if (match) {
      const { grievanceId } = match
      const { status } = body
      const grivIdx = db.grievances.findIndex(g => g.id === grievanceId)
      if (grivIdx === -1) return sendResponse(404, { detail: 'Grievance not found' })

      db.grievances[grivIdx].status = status
      if (!db.grievanceEvents[grievanceId]) db.grievanceEvents[grievanceId] = []
      db.grievanceEvents[grievanceId].push({
        id: `e-${uuid()}`,
        action: `Status updated to ${status} by admin`,
        timestamp: new Date().toISOString()
      })
      saveDb()
      return sendResponse(200, db.grievances[grivIdx])
    }

    match = matchRoute(path, '/websites/:id/grievances/:grievanceId/feedback')
    if (match) {
      const { grievanceId } = match
      const grivIdx = db.grievances.findIndex(g => g.id === grievanceId)
      if (grivIdx === -1) return sendResponse(404, { detail: 'Grievance not found' })

      db.grievances[grivIdx].feedback = body
      if (!db.grievanceEvents[grievanceId]) db.grievanceEvents[grievanceId] = []
      db.grievanceEvents[grievanceId].push({
        id: `e-${uuid()}`,
        action: 'Visitor submitted feedback',
        timestamp: new Date().toISOString()
      })
      saveDb()
      return sendResponse(200, db.grievances[grivIdx])
    }

    match = matchRoute(path, '/websites/:id/grievances/:grievanceId/evidence')
    if (match) {
      const { grievanceId } = match
      if (method === 'post') {
        if (!db.grievanceEvents[grievanceId]) db.grievanceEvents[grievanceId] = []
        db.grievanceEvents[grievanceId].push({
          id: `e-${uuid()}`,
          action: 'Evidence document uploaded',
          timestamp: new Date().toISOString()
        })
        saveDb()
        return sendResponse(200, {
          file_url: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=500',
          filename: 'uploaded_evidence.pdf'
        })
      }
      if (method === 'get') {
        return sendResponse(200, {
          file_url: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=500',
          filename: 'uploaded_evidence.pdf'
        })
      }
    }

    match = matchRoute(path, '/grievances/:id/events')
    if (match) {
      const { id } = match
      return sendResponse(200, db.grievanceEvents[id] || [])
    }

    // --- 8. NOTIFICATIONS & RETENTION ---
    match = matchRoute(path, '/websites/:id/notifications')
    if (match) {
      const { id } = match
      return sendResponse(200, db.notifications[id] || [])
    }

    match = matchRoute(path, '/websites/:id/notifications/send-renewal-reminders')
    if (match) {
      return sendResponse(200, { message: 'Renewal reminders sent successfully.' })
    }

    match = matchRoute(path, '/websites/:id/retention')
    if (match) {
      const { id } = match
      if (method === 'get') {
        return sendResponse(200, db.retention[id] || { duration_months: 12, enabled: true })
      }
      if (method === 'post') {
        db.retention[id] = body
        saveDb()
        return sendResponse(200, db.retention[id])
      }
    }

    // --- 9. PUBLIC PORTAL ---
    if (path === '/consents/lookup' && method === 'get') {
      const visitorId = params.visitor_id
      const filtered = db.consents.filter(c => c.visitor_id === visitorId)
      return sendResponse(200, filtered)
    }

    if (path === '/consents/withdraw' && method === 'post') {
      const { visitor_id, reason } = body
      // Find all consents for visitor and change to rejected
      db.consents.forEach((c, idx) => {
        if (c.visitor_id === visitor_id) {
          db.consents[idx].status = 'rejected'
          db.consents[idx].rejected_categories = { Necessary: true, Functional: true, Analytics: true, Advertising: true }
          db.consents[idx].accepted_categories = {}
        }
      })
      saveDb()
      return sendResponse(200, { message: 'Consent withdrawn successfully' })
    }

    if (path === '/consents/update' && method === 'post') {
      const { visitor_id, new_status, accepted_categories, rejected_categories } = body
      const newConsent = {
        id: `consent-${uuid()}`,
        visitor_id,
        status: new_status,
        accepted_categories,
        rejected_categories,
        ip_address: '192.168.1.99',
        country: 'US',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date().toISOString()
      }
      db.consents.unshift(newConsent)
      saveDb()
      return sendResponse(200, newConsent)
    }

    // --- 10. AUDIT LOGS ---
    if (path === '/audit' && method === 'get') {
      return sendResponse(200, db.audits)
    }

    match = matchRoute(path, '/audit/websites/:id')
    if (match) {
      const { id } = match
      const filtered = db.audits.filter(a => a.website_id === id)
      return sendResponse(200, filtered)
    }

    // Fallback 404
    console.warn(`Mock API received unhandled route: ${method.toUpperCase()} ${path}`)
    return sendResponse(404, { detail: `Route ${method.toUpperCase()} ${path} not found` })
  })
}

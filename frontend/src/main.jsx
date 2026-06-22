import './i18n/index.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Workaround for React 18 / Recharts "removeChild" crash on component unmount
if (typeof window !== 'undefined' && typeof Node !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function(child) {
    try {
      return originalRemoveChild.call(this, child);
    } catch (err) {
      if (err instanceof Error && /not a child of this node/.test(err.message)) {
        console.warn('Ignored React removeChild error:', err);
        return child;
      }
      throw err;
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)



import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/admin.css'
import './styles/builder.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: 'Barlow, sans-serif',
          fontSize: 13,
          background: '#fff',
          color: '#081b2e',
          border: '1px solid #cccccc',
        },
      }}
    />
  </StrictMode>,
)

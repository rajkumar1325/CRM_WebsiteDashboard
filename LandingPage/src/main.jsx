import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode> // ← temporarily disable StrictMode to avoid double useEffect calls
    <App />
  // </StrictMode>,
)

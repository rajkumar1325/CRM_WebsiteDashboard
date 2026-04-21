import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // <-- MUST BE IMPORTED HERE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- MUST WRAP <App /> HERE */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
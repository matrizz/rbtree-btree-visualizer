import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="w-full h-screen flex items-center justify-center">
      <App />
    </div>
  </StrictMode>,
)

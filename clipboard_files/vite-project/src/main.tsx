import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './clipboard_files/styles/globals.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

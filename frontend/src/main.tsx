import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TargetRoleProvider } from './context/TargetRoleContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TargetRoleProvider>
        <App />
      </TargetRoleProvider>
    </BrowserRouter>
  </StrictMode>,
)

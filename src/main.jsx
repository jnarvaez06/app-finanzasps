import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CatalogosProvider } from './context/CatalogosContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <CatalogosProvider>
            <App />
        </CatalogosProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CatalogosProvider } from './context/CatalogosContext.jsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <CatalogosProvider>
              <App />
          </CatalogosProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)

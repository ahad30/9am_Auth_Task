import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from "sonner";


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
    <Toaster expand={true} richColors />
    <App />
    </AuthProvider>
  </StrictMode>,
)

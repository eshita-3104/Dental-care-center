//main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import { AuthProvider } from './context/AuthContext'
import { PatientProvider } from './context/PatientContext'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>  
      <AuthProvider>
        <PatientProvider>
          <App />
        </PatientProvider>
      </AuthProvider>  
    </BrowserRouter> 
  </React.StrictMode>,
)
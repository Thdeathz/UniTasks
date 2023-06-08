import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'antd/dist/reset.css'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FirebaseAppProvider } from 'reactfire'
import { firebaseConfig } from './firebase/config'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </FirebaseAppProvider>
  </React.StrictMode>
)

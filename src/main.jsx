import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/bebas-neue'
import '@fontsource/dm-mono/400.css'
import '@fontsource-variable/space-grotesk'
import './index.css'
import App from './App'
import { SoundProvider } from './context/SoundContext'
import { ChaosProvider } from './context/ChaosContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SoundProvider>
        <ChaosProvider>
          <App />
        </ChaosProvider>
      </SoundProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

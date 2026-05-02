import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { installLocalStorageImportBridge } from './devtools/importLocalStorageToApi'
import './index.css'

installLocalStorageImportBridge()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

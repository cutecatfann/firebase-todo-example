/**
 * This file serves as the entry point for the React application.
 * It imports the necessary dependencies, sets up the root element,
 * and renders the main component of the application.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import UserStateProvider from './context/userState.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserStateProvider>
      <App />
    </UserStateProvider>
  </React.StrictMode>,
)

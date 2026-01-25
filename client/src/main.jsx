import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import UserStateProvider from './context/userState.jsx'
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@lichess-org/chessground/assets/chessground.cburnett.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserStateProvider>
      <App />
    </UserStateProvider>
  </React.StrictMode>,
)

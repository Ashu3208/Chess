import { useState } from 'react'
import './App.css'
import Pieces from "./components/Pieces"
import GameBoard from './components/GameBoard'
import './styles.css'
function App() {
  const [count, setCount] = useState(0)
  

  return (
    <div className="container">
      <GameBoard />
    </div>
  )
}

export default App

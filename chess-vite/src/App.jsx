import GameBoard from './components/GameBoard'
import GamePopup from './components/GamePopup'
import './styles.css'

function App() {
 
  return (
    <>
      <GamePopup />
    <div className="container">
      <GameBoard />
    </div>
    </>
  )
}

export default App

import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import Board from './Board'

export default function GameScreen() {
  const [game, setGame] = useState(new Chess());
  function handleMove(updatedGame) {
    setGame(updatedGame);
  }

  const playerTurn = game.turn() === "w" ? "white" : "black";
  // Check for game end
  const statusMessage = (() => {
    if (game.isCheckmate())
      return `Checkmate! ${playerTurn === "white" ? "Black" : "White"} wins`;
    if (game.isDraw()) return "Draw!";
    if (game.isCheck()) return `${playerTurn} is in check`;
    return `Turn: ${playerTurn}`;
  })();

  return (
    <div className="flex flex-col items-center mt-6">
      <Board game={game} onMove={handleMove} />
      <p className="mt-4 text-white text-lg">{statusMessage}</p>
    </div>
  );
}

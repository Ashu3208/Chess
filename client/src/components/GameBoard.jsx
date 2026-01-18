import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessground } from "@lichess-org/chessground";

export default function GameBoard() {
  const boardRef = useRef(null);
  const chessgroundRef = useRef(null);

  const [game, setGame] = useState(new Chess());
  const [playerTurn, setPlayerTurn] = useState("white");

  useEffect(() => {
    if (!boardRef.current) return;

    chessgroundRef.current = Chessground(boardRef.current, {
      position: game.fen(),
      draggable: { enabled: true },
      movable: {
        free: false,
        color: "white",
        dests: getLegalDests(game),
      },
      events: { move: handleMove },
    });

    return () => chessgroundRef.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute legal moves from chess.js
  function getLegalDests(chess) {
    const moves = chess.moves({ verbose: true });
    const dests = new Map();

    moves.forEach((m) => {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    });

    return dests;
  }

  // When a piece is moved
  function handleMove(from, to) {
    console.log(game);
    console.log(from);
    console.log(to);
    const updatedGame = new Chess(game.fen());
    const move = updatedGame.move({ from, to, promotion: "q" });

    if (!move) return;

    setGame(updatedGame);

    const nextTurn = updatedGame.turn() === "w" ? "white" : "black";
    setPlayerTurn(nextTurn);

    // Update board UI
    chessgroundRef.current.set({
      position: updatedGame.fen(),
      movable: {
        color: nextTurn,
        dests: getLegalDests(updatedGame),
      },
    });
  }

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
      <div ref={boardRef} className="w-130 h-130" />
      <p className="mt-4 text-white text-lg">{statusMessage}</p>
    </div>
  );
}

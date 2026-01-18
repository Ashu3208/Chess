import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import { Chess } from "chess.js";
import { Chessground } from "@lichess-org/chessground";

export default function ChessBoard() {
  const currUser = useContext(UserContext)
  const navigate=useNavigate()
  useEffect(()=>{
      if(currUser.state.id==null){
          navigate('/login')
      }
  })  
  
  const boardRef = useRef(null);
  const cgRef = useRef(null);
  const [game, setGame] = useState(new Chess());

  useEffect(() => {
    if (!boardRef.current) return;

    cgRef.current = Chessground(boardRef.current, {
      position: game.fen(),
      draggable: { enabled: true },
      movable: {
        color: "white",
        free: false,
        dests: getDests(game),
      },
      events: { move: handleMove },
    });

    return () => cgRef.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getDests(chess) {
    const dests = {};
    chess.moves({ verbose: true }).forEach((m) => {
      if (!dests[m.from]) dests[m.from] = [];
      dests[m.from].push(m.to);
    });
    return dests;
  }

  function handleMove(from, to) {
    const updated = new Chess(game.fen());
    const move = updated.move({ from, to, promotion: "q" });
    if (!move) return;

    setGame(updated);
    cgRef.current.set({
      position: updated.fen(),
      movable: {
        color: updated.turn() === "w" ? "white" : "black",
        dests: getDests(updated),
      },
    });
  }

  return (
    <div className="flex justify-center mt-10">
      <div ref={boardRef} className="w-120 h-120" />
    </div>
  );
}

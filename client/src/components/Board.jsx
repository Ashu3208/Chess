import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useContext } from "react";
import { Chess } from "chess.js";
import { Chessground } from "@lichess-org/chessground";

export default function Board({ game, onMove }) {
  const userId = useContext(UserContext).state.id;
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const boardRef = useRef(null);
  const cgRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current) return;

    cgRef.current = Chessground(boardRef.current, {
      position: game.fen(),
      draggable: { enabled: true },
      movable: {
        color: game.turn() === "w" ? "white" : "black",
        free: false,
        dests: getLegalDests(game),
      },
      events: { move: handleMove },
    });

    return () => cgRef.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // recompute board when game change
  useEffect(() => {
      if (!cgRef.current) return;
      cgRef.current.set({
        position: game.fen(),
        movable: {
          color: game.turn() === "w" ? "white" : "black",
          dests: getLegalDests(game),
        },
      });
    }, [game]);
  
  function getLegalDests(chess) {
    const moves = chess.moves({ verbose: true });
    const dests = new Map();

    moves.forEach((m) => {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    });

    return dests;
  }

  function handleMove(from, to) {
    const updated = new Chess(game.fen());
    const move = updated.move({ from, to, promotion: "q" });
    if (!move) return;

    onMove(updated);
  }

  return (
    <div className="flex justify-center mt-10">
      <div ref={boardRef} className="w-120 h-120" />
    </div>
  );
}


import PropTypes from "prop-types";

Board.propTypes = {
  game: PropTypes.object.isRequired,
  onMove: PropTypes.func.isRequired,
};

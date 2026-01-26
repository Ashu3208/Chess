import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useContext, useState } from "react";
import { Chess } from "chess.js";
import { Chessground } from "@lichess-org/chessground";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

Board.propTypes = {
  game: PropTypes.object.isRequired,
  onMove: PropTypes.func.isRequired,
};

export default function Board({ game, onMove }) {
  const userId = useContext(UserContext).state.id;
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const is_guest = params.get("guest");

  useEffect(() => {
    if (!is_guest && !userId) {
      navigate("/login");
    }
  }, [userId, navigate, is_guest]);

  const boardRef = useRef(null);
  const cgRef = useRef(null);
  const [pendingPromotion, setPendingPromotion] = useState(false);
  const handleMoveRef = useRef(handleMove);
  handleMoveRef.current = handleMove;

  useEffect(() => {
    if (!boardRef.current) return;

    cgRef.current = Chessground(boardRef.current, {
      fen: game.fen(),
      draggable: { enabled: true },
      movable: {
        color: game.turn() === "w" ? "white" : "black",
        free: false,
        dests: getLegalDests(game),
      },
      events: { move: (from, to) => handleMoveRef.current(from, to) },
    });

    return () => cgRef.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // recompute board when game change
  useEffect(() => {
    if (!cgRef.current) return;
    cgRef.current.set({
      fen: game.fen(),
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
    const legal = game
      .moves({ verbose: true })
      .filter((m) => m.from === from && m.to === to);

    if (legal.length > 1) {
      const options = legal.map((m) => m.promotion);
      setPendingPromotion({ from, to, options });
      return;
    }

    const updated = new Chess(game.fen());
    updated.move({ from, to });
    onMove(updated);
  }

  function promote(piece) {
    const { from, to } = pendingPromotion;
    const updated = new Chess(game.fen());
    updated.move({ from, to, promotion: piece });
    setPendingPromotion(false);
    onMove(updated);
  }

  return (
    <div className="flex justify-center mt-10">
      <div ref={boardRef} className="w-3xl h-192" />
      {pendingPromotion && (
        <div className="absolute bg-black/80 p-4 rounded">
          {["q", "r", "b", "n"].map((p) => (
            <button
              key={p}
              onClick={() => promote(p)}
              className="text-white text-2xl m-2"
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

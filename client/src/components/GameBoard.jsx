import { useState, useEffect } from "react";
import Piece from "./Pieces";
import {
  dragStart,
  dragOver,
  dragDrop,
  startPieces,
  getColor,
} from "../utilities/moves";
import "../styles.css";
export default function GameBoard() {
  const [playerGo, setPlayerGo] = useState("white");
  const [draggedElement, setDraggedElement] = useState(null);
  const [startPositionId, setStartPositionId] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");

  const togglePlayer = (player) => {
    setPlayerGo(player);
  };

  const handleDragStart = (e) => {
    dragStart(e, setDraggedElement, setStartPositionId);
  };

  const handleDragDrop = (e) => {
    dragDrop(
      e,
      draggedElement,
      playerGo,
      togglePlayer,
      startPositionId,
      setInfoMessage,
    );
  };

  useEffect(() => {
    if (infoMessage) {
      const timer = setTimeout(() => setInfoMessage(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [infoMessage]);

  return (
    <div className="w-auto bg-[#DBE7C9] rounded-xl pt-[5.4vh] px-20 pb-[2.6vh] m-2">
      <div id="gameboard">
        {startPieces.map((piece, i) => (
          <div
            className={`square ${getColor(i)} `}
            key={i}
            data-square-id={i}
            onDragStart={handleDragStart}
            onDragOver={dragOver}
            onDrop={handleDragDrop}
          >
            {(i <= 15 || i >= 48) && (
              <Piece piece={piece} color={i <= 15 ? "white" : "black"} />
            )}
          </div>
        ))}
      </div>
      <div id="player-display">
        <p>
          It is <span id="player">{playerGo}</span>&apos;s turn{" "}
        </p>
      </div>
      {infoMessage && <p id="info-display">{infoMessage}</p>}
    </div>
  );
}

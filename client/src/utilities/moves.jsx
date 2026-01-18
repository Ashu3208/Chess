const width = 8;
import moveSelfSound from "../assets/move-self.mp3";

export const startPieces = [
    "rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook",
    "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn",
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn",
    "rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"
]

export const getColor = (i) => {
    const row = Math.floor((63 - i) / 8) + 1
    return (row % 2 === 0 ? (i % 2 === 0 ? "brown" : "beige") : (i % 2 === 0 ? "beige" : "brown"));
}

export function dragStart(e, setDraggedElement, setStartPositionId) {
  setDraggedElement(e.target);
  setStartPositionId(e.target.parentNode.getAttribute("data-square-id"));
}

export function dragOver(e) {
  e.preventDefault();
}

export function dragDrop(
  e,
  draggedElement,
  playerGo,
  togglePlayer,
  startPositionId,
  setInfoMessage,
) {
  e.stopPropagation();
  const correctGo = draggedElement.firstChild.classList.contains(playerGo);
  const taken = e.target.classList.contains("piece");
  const valid = checkIfValid(e.target, draggedElement, startPositionId);
  const opponentGo = playerGo === "white" ? "black" : "white";
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
  const infoDisplay = document.querySelector("#info-display");
  if (correctGo) {
    if (takenByOpponent && valid) {
      e.target.parentNode.append(draggedElement);
      e.target.remove();
      // sendMove(startPositionId, e.target.getAttribute('square-id'));
      checkForWin(infoDisplay);
      changePlayer(togglePlayer, playerGo);
      const snd = new Audio(moveSelfSound);
      snd.play();
      return;
    }

    if (taken) {
      setInfoMessage("You cannot go here");
      return;
    }

    if (valid) {
      e.target.append(draggedElement);
      // sendMove(startPositionId, e.target.getAttribute('square-id'));
      checkForWin(infoDisplay);
      changePlayer(togglePlayer, playerGo);
      const snd = new Audio(moveSelfSound);
      snd.play();
      return;
    }
  }
}

function checkIfValid(target, draggedElement, startPositionId) {
  const targetId =
    Number(target.getAttribute("data-square-id")) ||
    Number(target.parentNode.getAttribute("data-square-id"));
  const startId = Number(startPositionId);
  const piece = draggedElement.id;

  switch (piece) {
    case "pawn":
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
      if (
        (starterRow.includes(startId) && startId + width * 2 === targetId) ||
        startId + width === targetId ||
        (startId + width - 1 === targetId &&
          document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width + 1 === targetId &&
          document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;
    case "knight":
      if (
        startId + width * 2 - 1 === targetId ||
        startId + width * 2 + 1 === targetId ||
        startId + width - 2 === targetId ||
        startId + width + 2 === targetId ||
        startId - width * 2 + 1 === targetId ||
        startId - width * 2 - 1 === targetId ||
        startId - width - 2 === targetId ||
        startId - width + 2 === targetId
      ) {
        return true;
      }
      break;
    case "bishop":
      if (
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        (startId - width * 5 + 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        (startId - width * 6 + 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        (startId - width * 7 + 7 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        (startId + width * 4 - 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        (startId + width * 5 - 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        (startId + width * 6 - 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 5 - 5}"]`)
            .firstChild) ||
        (startId + width * 7 - 7 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 6 - 6}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;
    case "rook":
      if (
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 5}"]`)
            .firstChild) ||
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4}"]`)
            .firstChild) ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 5}"]`)
            .firstChild) ||
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 3}"]`).firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 4}"]`).firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 5}"]`).firstChild) ||
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 3}"]`).firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 4}"]`).firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 5}"]`).firstChild)
      ) {
        return true;
      }
      break;
    case "queen":
      if (
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        (startId - width * 5 + 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        (startId - width * 6 + 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        (startId - width * 7 + 7 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        (startId + width * 4 - 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        (startId + width * 5 - 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        (startId + width * 6 - 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 5 - 5}"]`)
            .firstChild) ||
        (startId + width * 7 - 7 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 6 - 6}"]`)
            .firstChild) ||
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId + width * 5}"]`)
            .firstChild) ||
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4}"]`)
            .firstChild) ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[data-square-id="${startId - width * 5}"]`)
            .firstChild) ||
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 3}"]`).firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 4}"]`).firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId + 5}"]`).firstChild) ||
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[data-square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[data-square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[data-square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 3}"]`).firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[data-square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 4}"]`).firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[data-square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[data-square-id="${startId - 5}"]`).firstChild)
      ) {
        return true;
      }
      break;
    case "king":
      if (
        startId + 1 === targetId ||
        startId - 1 === targetId ||
        startId + width === targetId ||
        startId - width === targetId ||
        startId + width - 1 === targetId ||
        startId + width + 1 === targetId ||
        startId - width - 1 === targetId ||
        startId - width + 1 === targetId
      ) {
        return true;
      }
  }
  return false;
}
const changePlayer = (togglePlayer, playerGo) => {
  if (playerGo === "white") {
    reverseIds();
    togglePlayer("black");
  } else {
    revertIds();
    togglePlayer("white");
  }
};

function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) =>
    square.setAttribute("data-square-id", width * width - 1 - i),
  );
}

function revertIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => {
    square.setAttribute("data-square-id", i);
  });
}

function checkForWin(infoDisplay) {
  const kings = Array.from(document.querySelectorAll("#king"));
  console.log(kings);
  if (!kings.some((king) => king.firstChild.classList.contains("white"))) {
    infoDisplay.classList.remove("hidden");
    infoDisplay.innerHTML = "Black player wins!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false),
    );
  }
  if (!kings.some((king) => king.firstChild.classList.contains("black"))) {
    infoDisplay.classList.remove("hidden");
    infoDisplay.innerHTML = "White player wins!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false),
    );
  }
}

// function sendMove(startPositionId, targetPositionId) {
//     socket.emit('move', { startPositionId, targetPositionId });
//   }

// // Listen for the 'move' event from the server and update the board accordingly
// socket.on('move', ({ startPositionId, targetPositionId }) => {
//     const startPosition = document.querySelector(`[square-id="${startPositionId}"]`);
//     const targetPosition = document.querySelector(`[square-id="${targetPositionId}"]`);
//     targetPosition.append(startPosition.firstChild);
//     changePlayer();
//   });

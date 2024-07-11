import {React, useState, useEffect} from "react";
import Piece from "./Pieces";
import { dragStart, dragOver, dragDrop } from "../utilities/moves"; 

export default function GameBoard() {
    const [playerGo, setPlayerGo] = useState('white');
    const [draggedElement, setDraggedElement] = useState(null);
    const [startPositionId, setStartPositionId] = useState(null);

    const togglePlayer = (player) => {
        setPlayerGo(player)
    }
    const startPieces = [
        "rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook",
        "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn",
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn",
        "rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"
    ]
    const getColor = (i) => {
        const row = Math.floor((63 - i) / 8) + 1
        return (row % 2 === 0 ? (i % 2 === 0 ? "brown" : "beige") : (i % 2 === 0 ? "beige" : "brown"));
    }
     useEffect(() => {
        const allSquares = document.querySelectorAll(".square");

        const handleDragStart = (e) => {
            dragStart(e, setDraggedElement, setStartPositionId);
        };

        const handleDragDrop = (e) => {
            dragDrop(e, draggedElement, playerGo, togglePlayer, startPositionId);
            
        };

        allSquares.forEach(square => {
            square.addEventListener('dragstart', handleDragStart);
            square.addEventListener('dragover', dragOver);
            square.addEventListener('drop', handleDragDrop);
        });

        return () => {
            allSquares.forEach(square => {
                square.removeEventListener('dragstart', handleDragStart);
                square.removeEventListener('dragover', dragOver);
                square.removeEventListener('drop', handleDragDrop);
            });
        };
    }, [draggedElement, playerGo]);

    return (
        
        <div id="gameboard">
            {
                startPieces.map((piece,i) => (
                    <div className={`square ${getColor(i)} `} key={i} square-id={i}>
                        { (i<=15 || i>=48) &&   
                            <Piece piece={piece} color={i<=15?"white":"black"}/>
                        }                       
                    </div>
                ))
            }
        </div>
    )
}
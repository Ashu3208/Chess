import { Button } from "@mui/material";
import React, {useState} from "react";
import { Link } from "react-router-dom";
import GamePopup from "./GamePopup";

export default function Home() {
    const [isGamePopupOpen, setIsGamePopupOpen] = useState(false);

    const toggleGamePopup = () => {
        isGamePopupOpen==true?setIsGamePopupOpen(false):
        setIsGamePopupOpen(true);
    };
    return (
        <>
        <Link to='/signUp'>Sign Up</Link>
        <Link to= '/login'>Login</Link>
        <Button  onClick={toggleGamePopup} variant="contained"> Play as a Guest </Button>
        <GamePopup open={isGamePopupOpen} toggleGamePopup={toggleGamePopup}/>
        </>
    )
}
import { Button } from "@mui/material";
import React, {useState} from "react";
import { Link } from "react-router-dom";
import NewGamePopup from "./NewGamePopup";
import JoinGamePopup from "./JoinGamePopup";

export default function Home() {
    const [NewGamePopupOpen, setNewGamePopup] = useState(false);
    const [JoinGamePopupOpen, setJoinGamePopup] = useState(false);
    const toggleNewGamePopup = () => {
        NewGamePopupOpen==true?setNewGamePopup(false):
        setNewGamePopup(true);
    };

    const toggleJoinGamePopup = () => {
        JoinGamePopupOpen==true?setJoinGamePopup(false):
        setJoinGamePopup(true);
    };
    
    return (
        <>
        <Link to='/signUp'>Sign Up</Link>
        <Link to= '/login'>Login</Link>
        <Button  onClick={toggleNewGamePopup} variant="contained"> Play as a Guest </Button>
        <NewGamePopup open={NewGamePopupOpen} toggleNewGamePopup={toggleNewGamePopup} toggleJoinGamePopup={toggleJoinGamePopup} />
        <JoinGamePopup open={JoinGamePopupOpen} toggleNewGamePopup={toggleNewGamePopup} toggleJoinGamePopup={toggleJoinGamePopup}  />
        </>
    )
}
import { Button, Toolbar, Typography,Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import NewGamePopup from "./NewGamePopup";
import JoinGamePopup from "./JoinGamePopup";
import Appbar from "@mui/material/AppBar"
import logo from "../assets/chess-navbar.png";
import Chesslogo from "/chess.png"
export default function Home() {
    const [NewGamePopupOpen, setNewGamePopup] = useState(false);
    const [JoinGamePopupOpen, setJoinGamePopup] = useState(false);
    const toggleNewGamePopup = () => {
        NewGamePopupOpen == true ? setNewGamePopup(false) :
            setNewGamePopup(true);
    };

    const toggleJoinGamePopup = () => {
        JoinGamePopupOpen == true ? setJoinGamePopup(false) :
            setJoinGamePopup(true);
    };

    return (
        <>
            <Appbar
                className="navbar1">
                <Toolbar variant="regular" sx={{ backgroundColor: "#F0EDCF" }} >
                <IconButton edge="start" color="inherit" aria-label="logo"  sx={{'&:hover': {backgroundColor: 'transparent'},'&:focus': {outline:'none'} }}>
                        <img src={Chesslogo} alt="Chess Logo" style={{height: 40 }} />
                        <img src={logo} alt="Chess Logo" style={{height: 40 }} />
                    </IconButton>
                    <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography component={Link} to='/'  sx={{ textDecoration: 'none', color: '#508D4E' }}>
                        Home
                    </Typography>
                    <Typography component={Link} to='/signup'  sx={{ textDecoration: 'none', color: '#508D4E' }}>
                        Sign Up
                    </Typography>
                    <Typography component={Link} to='/login'  sx={{ textDecoration: 'none', color: '#508D4E' }}>
                        Login
                    </Typography>
                    <Button onClick={toggleNewGamePopup} variant="contained" > Play as a Guest </Button>
                    </Box>
                        <NewGamePopup open={NewGamePopupOpen} toggleNewGamePopup={toggleNewGamePopup} toggleJoinGamePopup={toggleJoinGamePopup} />
                        <JoinGamePopup open={JoinGamePopupOpen} toggleNewGamePopup={toggleNewGamePopup} toggleJoinGamePopup={toggleJoinGamePopup} />
                </Toolbar>
            </Appbar>
        </>
    )
}
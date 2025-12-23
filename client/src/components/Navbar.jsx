import { Button, Toolbar, Typography, Box, IconButton } from "@mui/material";
import React, { useState, useContext } from "react";
import { Link, useNavigate, } from "react-router-dom";
import NewGamePopup from "./NewGamePopup";
import JoinGamePopup from "./JoinGamePopup";
import Appbar from "@mui/material/AppBar"
import logo from "../assets/chess-navbar.png";
import Chesslogo from "/chess.png"
import UserContext from "../context/user"
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Navbar() {
    const authUser = useContext(UserContext)
    console.log(authUser)
    const navigate = useNavigate();

    const [NewGamePopupOpen, setNewGamePopup] = useState(false);
    const [JoinGamePopupOpen, setJoinGamePopup] = useState(false);

    const logout = async () => {
        console.log("removing")
        cookies.remove("TOKEN", { path: '/' });
        navigate("/")
        navigate(0);
    };

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
                <Toolbar variant="regular" sx={{ backgroundColor: "#100F0F" }} >
                    <IconButton edge="start" component={Link} to='/' color="inherit" aria-label="logo" sx={{ '&:hover': { backgroundColor: 'transparent' }, '&:focus': { outline: 'none' } }}>
                        <img src={Chesslogo} alt="Chess Logo" style={{ height: 40 }} />
                        <img src={logo} alt="Chess Logo" style={{ height: 40 }} />
                    </IconButton>
                    <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography component={Link} to='/play' sx={{ textDecoration: 'none', color: '#508D4E' }}>
                            Play
                        </Typography>
                        {authUser.state.id ? (
                            <Button onClick={logout} variant="contained">Logout</Button>)
                            : (<>
                                <Typography component={Link} to='/login' sx={{ textDecoration: 'none', color: '#508D4E' }}>
                                    Login
                                </Typography>
                                <Button onClick={toggleNewGamePopup} variant="contained" > Play as a Guest </Button>
                            </>)}

                    </Box>
                    <NewGamePopup open={NewGamePopupOpen} toggleNewGamePopup={toggleNewGamePopup} toggleJoinGamePopup={toggleJoinGamePopup} />
                    <JoinGamePopup open={JoinGamePopupOpen} toggleNewGamePopup={toggleNewGamePopup} toggleJoinGamePopup={toggleJoinGamePopup} />
                </Toolbar>
            </Appbar>
        </>
    )
}
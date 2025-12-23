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

    const [isNewGameOpen, setIsNewGameOpen] = useState(false);
    const [isJoinGameOpen, setIsJoinGameOpen] = useState(false);

    const logout = async () => {
        console.log("removing")
        cookies.remove("TOKEN", { path: '/' });
        navigate(0)
    };


    const setPopupValue = (newGameValue, joinGameValue) => {
        setIsNewGameOpen(newGameValue);
        setIsJoinGameOpen(joinGameValue);
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
                        {authUser.state.id ? (
                            <>
                                <Typography component={Link} to='/play' sx={{ textDecoration: 'none', color: '#508D4E' }}>
                                    Play
                                </Typography>
                                <Button onClick={logout} variant="contained">Logout</Button>
                            </>
                        )
                            : (<>
                                <Link to='/login' className="text-green-400 text-sm font-bold border-2 border-green rounded-md p-1">
                                    Login
                                </Link>
                                <Link to='/register' className="text-amber-400 text-sm font-bold border-2 border-green rounded-md p-1">
                                    Sign Up
                                </Link>
                                <Button onClick={() => setPopupValue(true, false)} variant="contained" > Play as a Guest </Button>
                            </>)}

                    </Box>
                    <NewGamePopup open={isNewGameOpen} setPopupValue={setPopupValue} />
                    <JoinGamePopup open={isJoinGameOpen} setPopupValue={setPopupValue} />
                </Toolbar>
            </Appbar>
        </>
    )
}
import { Button, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import GamePopup from "./GamePopup";
import Appbar from "@mui/material/AppBar";
import logo from "../assets/chess-navbar.png";
import Chesslogo from "/chess.png";
import UserContext from "../context/user";

export default function Navbar() {
  const authUser = useContext(UserContext);
  const navigate = useNavigate();

  const [isGamePopupOpen, setIsGamePopupOpen] = useState(false);

  const handleLogout = async () => {
    if (authUser.logout) {
      await authUser.logout();
    }
    navigate(0); // Refresh page to clear state
  };

  const toggleGamePopup = (value) => setIsGamePopupOpen(value);

  return (
    <>
      <Appbar className="navbar1">
        <Toolbar variant="regular" sx={{ backgroundColor: "#100F0F" }}>
          <IconButton
            edge="start"
            component={Link}
            to="/"
            color="inherit"
            aria-label="logo"
            sx={{
              "&:hover": { backgroundColor: "transparent" },
              "&:focus": { outline: "none" },
            }}
          >
            <img src={Chesslogo} alt="Chess Logo" style={{ height: 40 }} />
            <img src={logo} alt="Chess Logo" style={{ height: 40 }} />
          </IconButton>
          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {authUser.state.id ? (
              <>
                <Typography
                  component={Link}
                  to="/play"
                  sx={{ textDecoration: "none", color: "#508D4E" }}
                >
                  Play
                </Typography>
                <Typography
                  component={Link}
                  sx={{ textDecoration: "none", color: "#508D4E" }}
                >
                  LeaderBoard
                </Typography>
                <Typography
                  component={Link}
                  sx={{ textDecoration: "none", color: "#508D4E" }}
                >
                  GameHistory
                </Typography>
                <Typography
                  component={Link}
                  sx={{ textDecoration: "none", color: "#508D4E" }}
                >
                  Profile
                </Typography>
                <Button onClick={handleLogout} variant="contained">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-green-400 text-sm font-bold border-2 border-green rounded-md p-1"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-amber-400 text-sm font-bold border-2 border-green rounded-md p-1"
                >
                  Sign Up
                </Link>
                <Button
                  onClick={() => toggleGamePopup(true)}
                  variant="contained"
                >
                  {" "}
                  Play as a Guest{" "}
                </Button>
              </>
            )}
          </Box>
          <GamePopup
            open={isGamePopupOpen}
            onClose={() => toggleGamePopup(false)}
          />
        </Toolbar>
      </Appbar>
    </>
  );
}

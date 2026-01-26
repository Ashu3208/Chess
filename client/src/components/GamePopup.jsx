import { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const GamePopup = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("choose"); // choose | join
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (open) {
      setMode("choose");
      setRoomId("");
    }
  }, [open]);

  const handleClose = () => {
    setMode("choose");
    setRoomId("");
    onClose?.();
  };

  const handleNewGame = async () => {
    const uri = `${import.meta.env.VITE_SERVER_URI}/game/new`;
    try {
      const response = await fetch(uri, { method: "GET" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create a new game");
      }
      const data = await response.json();
      if (data.roomUrl) {
        navigate(data.roomUrl + "?guest=true");
        handleClose();
      }
    } catch (error) {
      console.error("Error fetching new game:", error);
    }
  };

  const handleJoinGame = async () => {
    const uri = `${import.meta.env.VITE_SERVER_URI}/game/join`;
    try {
      const response = await fetch(uri, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ joinId: roomId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join the game");
      }
      const data = await response.json();
      if (data.roomUrl) {
        navigate(data.roomUrl);
        handleClose();
      }
    } catch (error) {
      console.error("Error joining the game:", error);
    }
  };

  const renderChoose = () => (
    <>
      <Typography variant="h6" component="h2">
        Welcome to Chess Game!
      </Typography>
      <Typography sx={{ mt: 2 }}>Please choose an option:</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="contained" onClick={handleNewGame}>
          New Game
        </Button>
        <Button variant="contained" onClick={() => setMode("join")}>
          Join a Game
        </Button>
      </Box>
    </>
  );

  const renderJoin = () => (
    <>
      <Typography variant="h6" component="h2">
        Join a Game
      </Typography>
      <Typography sx={{ mt: 2 }}>Enter the room ID below:</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <TextField
          id="room-id"
          label="RoomId"
          variant="outlined"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button variant="contained" onClick={handleJoinGame}>
          Join
        </Button>
        <Button variant="contained" onClick={() => setMode("choose")}>
          Back
        </Button>
      </Box>
    </>
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyles}>
        {mode === "join" ? renderJoin() : renderChoose()}
      </Box>
    </Modal>
  );
};

GamePopup.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default GamePopup;

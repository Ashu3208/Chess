import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const GamePopup = () => {
  const [open, setOpen] = useState(true);

  const handleNewGame = () => {
    console.log('New Game button clicked');
    fetch('/game/new', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        if (data.joinGameId) {
          window.localStorage.setItem('roomId', data.joinGameId);
        }
        if (data.roomUrl) {
          window.localStorage.setItem('roomUrl', data.roomUrl);
          window.location.href = `/game/${data.newGameId}`;
        } else {
          console.log('Response received but not redirected:', response);
        }
      })
      .catch(error => {
        console.error('Error fetching new game:', error);
      });
  };

  const handleJoinGame = () => {
    console.log('Join a Game button clicked');
    setOpen(false);
    // Implement showPopup('join-popup') logic here
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Welcome to Chess Game!
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Please choose an option:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" onClick={handleNewGame}>New Game</Button>
          <Button variant="contained" onClick={handleJoinGame}>Join a Game</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default GamePopup;

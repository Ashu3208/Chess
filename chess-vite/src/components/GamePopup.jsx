import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GamePopup = ({open, toggleGamePopup}) => {
  const navigate = useNavigate();
  const handleNewGame = () => {
    toggleGamePopup()
    console.log('New Game button clicked');
    fetch('http://localhost:3000/game/new', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        // navigate(data.roomUrl)
        window.location.href = data.roomUrl;
      })
      .catch(error => {
        console.error('Error fetching new game:', error);
      });
      
  };

  const handleJoinGame = () => {
    console.log('Join a Game button clicked');
    // Implement showPopup('join-popup') logic here
  };

  return (
    <Modal open={open}>
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

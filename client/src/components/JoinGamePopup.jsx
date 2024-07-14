import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const JoinGamePopup = ({open,  toggleNewGamePopup, toggleJoinGamePopup}) => {
  
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  
  const handleBack = async() => {
    toggleJoinGamePopup()
    toggleNewGamePopup()
      
  };

  const handleChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleJoinGame = async() => {
    console.log('Join  button clicked');
    const uri = `${import.meta.env.VITE_SERVER_URI}/game/join`
    try{

        
        const response = await fetch(uri,{
            method:"POST",
            headers:{
                'Content-type': 'application/json',
            },
            body:JSON.stringify({joinId:roomId}),
        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to join the game');
        }
        const data = await response.json();
        if (data.roomUrl) {
            navigate(data.roomUrl)
        }
    
    }catch(error){
        console.error('Error joining the game: ',error)
    }
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
          <TextField id="outlined-basic" label="RoomId" variant="outlined"  value={roomId} onChange={handleChange} />
          <Button  variant="contained" onClick={handleJoinGame} > Join </Button>
          <Button  variant="contained" onClick={handleBack} > Back </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default JoinGamePopup;

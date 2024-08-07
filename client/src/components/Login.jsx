import React, { useState, useContext,useEffect } from "react";
import { Button, TextField, createTheme, ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import Cookies from "universal-cookie";
import UserContext from "../context/user";
import NewGamePopup from "./NewGamePopup";
import JoinGamePopup from "./JoinGamePopup"

export default function Login() {

  const navigate = useNavigate()
  const cookies = new Cookies()
  const authUser = useContext(UserContext)
  const [NewGamePopupOpen, setNewGamePopup] = useState(false);
  const [JoinGamePopupOpen, setJoinGamePopup] = useState(false);

  const [userDetails, setUserDetails] = useState({ email: "", password: "" })
  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const uri = `${import.meta.env.VITE_SERVER_URI}/user/login`
    const { email, password } = userDetails
    axios.post(
      uri,
      {
        email, password
      }
    )
      .then((response) => {
        if (response.status == 200) {
          cookies.set("TOKEN", response.data.token, { path: '/' })
          authUser.getCurrUser();
          navigate("/")
        }

      })
      .catch((error) => { console.log(error) })
  };

  const toggleNewGamePopup = () => {
    NewGamePopupOpen == true ? setNewGamePopup(false) :
      setNewGamePopup(true);
  };

  const toggleJoinGamePopup = () => {
    JoinGamePopupOpen == true ? setJoinGamePopup(false) :
      setJoinGamePopup(true);
  };
  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ffffff',  // White border
              },
              '&:hover fieldset': {
                borderColor: '#ffffff',  // White border on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ffffff',  // White border when focused
              },
            },
            '& .MuiInputBase-input': {
              color: '#ffffff',  // White text color
            },
            '& .MuiInputLabel-root': {
              color: '#ffffff',  // White label color
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#ffffff',  // White label color when focused
            },
          },
        },
      },
    },
  })

  useEffect(()=>{
    if(authUser.state.id){
      navigate('/')
    }
  })

  return (
    <>
    <ThemeProvider theme={theme} >
      <form onSubmit={handleSubmit}>
        <TextField id="outlined-basic" label="Email" variant="outlined" name="email" value={userDetails.email} onChange={handleChange} />
        <TextField id="outlined-basic" label="Password" variant="outlined" name="password" value={userDetails.password} onChange={handleChange} />
        <Button type="submit">Submit</Button>
      </form>
      <Button onClick={() => navigate('/register')}>New? Sign Up </Button>
      <Button onClick={toggleNewGamePopup}>Play as a Guest</Button>
    </ThemeProvider>
      <NewGamePopup open={NewGamePopupOpen} toggleNewGamePopup={toggleNewGamePopup} toggleJoinGamePopup={toggleJoinGamePopup} />
      <JoinGamePopup open={JoinGamePopupOpen} toggleNewGamePopup={toggleNewGamePopup} toggleJoinGamePopup={toggleJoinGamePopup} />
      </>
  );
}

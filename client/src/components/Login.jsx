import React, { useState, useContext, useEffect } from "react";
import { Button, TextField, createTheme, ThemeProvider, Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import Cookies from "universal-cookie";
import UserContext from "../context/user";

export default function Login() {

  const navigate = useNavigate()
  const cookies = new Cookies()
  const authUser = useContext(UserContext)

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

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#58a6ff',
      },
      background: {
        default: '#0d1117',
        paper: '#161b22',
      },
    },
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
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: '96px', // keep content below navbar
          pb: 4,
          px: 2,
          bgcolor: 'background.default',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            bgcolor: 'background.paper',
            border: '1px solid #30363d',
          }}
        >
          <Typography variant="h5" fontWeight={700} textAlign="center">
            Login to Chess
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={userDetails.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              name="password"
              type="password"
              value={userDetails.password}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" size="large" fullWidth>
              Sign In
            </Button>
          </form>
          <Button variant="outlined" fullWidth onClick={() => navigate('/register')}>
            New? Sign Up
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

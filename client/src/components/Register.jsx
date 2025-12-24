import React, { useState, useContext, useEffect } from "react";
import { Button, TextField, ThemeProvider, createTheme, Box, Paper, Typography, InputAdornment, Divider, Alert } from "@mui/material";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import UserContext from "../context/user";

export default function Register() {
  
  const navigate = useNavigate()
  const authUser = useContext(UserContext)
  const cookies = new Cookies()

  const [userDetails, setUserDetails] = useState({ email: "", password: "", username: "" })
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    // console.log(e.target.name)
    // console.log(userDetails)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const uri = `${import.meta.env.VITE_SERVER_URI}/user/register`
      const { username, email, password } = userDetails
      const res = await axios.post(uri, { username, email, password });

      if (res.status === 201) {
        const { accessToken, refreshToken } = res.data;
        
        // Store both tokens in cookies
        cookies.set("ACCESS_TOKEN", accessToken, { path: '/' });
        cookies.set("REFRESH_TOKEN", refreshToken, { path: '/' });
        
        // Get current user info
        authUser.getCurrUser();
        navigate('/')
      } else {
        setError(res.data?.msg || res.data?.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.msg || err?.response?.data?.error;
      setError(apiMessage || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#58a6ff' },
      background: {
        default: '#05070f',
        paper: 'rgba(20, 26, 38, 0.9)',
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#ffffff' },
              '&:hover fieldset': { borderColor: '#ffffff' },
              '&.Mui-focused fieldset': { borderColor: '#ffffff' },
            },
            '& .MuiInputBase-input': { color: '#ffffff' },
            '& .MuiInputLabel-root': { color: '#ffffff' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#ffffff' },
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
          position: 'relative',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: '96px',
          pb: 4,
          px: 2,
          bgcolor: 'radial-gradient(circle at 20% 20%, rgba(88,166,255,0.08), transparent 25%), radial-gradient(circle at 80% 0%, rgba(88,166,255,0.06), transparent 22%), #05070f',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(2px)',
            pointerEvents: 'none',
            opacity: 0.6,
          }}
        />
        <Paper
          elevation={6}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 420,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            bgcolor: 'background.paper',
            border: '1px solid rgba(88,166,255,0.18)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.35)',
            backdropFilter: 'blur(16px)',
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={800}>
              Create your account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a username and secure your seat at the board.
            </Typography>
          </Box>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              value={userDetails.username}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: '#8b949e' }}>
                    👤
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={userDetails.email}
              onChange={handleChange}
              fullWidth
              required
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: '#8b949e' }}>
                    @
                  </InputAdornment>
                ),
              }}
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
              autoComplete="new-password"
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>
              Create Account
            </Button>
          </form>
          <Divider flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <Button variant="outlined" fullWidth onClick={() => navigate('/login')}>
            Already have an account? Log in
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

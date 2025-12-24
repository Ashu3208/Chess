import React, { useState, useContext, useEffect } from "react";
import { Button, TextField, createTheme, ThemeProvider, Box, Paper, Typography, InputAdornment, Divider, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import Cookies from "universal-cookie";
import UserContext from "../context/user";

export default function Login() {

  const navigate = useNavigate()
  const cookies = new Cookies()
  const authUser = useContext(UserContext)

  const [userDetails, setUserDetails] = useState({ email: "", password: "" })
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      const uri = `${import.meta.env.VITE_SERVER_URI}/user/login`
      const { email, password } = userDetails
      const response = await axios.post(uri, { email, password });

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;
        
        // Store both tokens in cookies
        cookies.set("ACCESS_TOKEN", accessToken, { path: '/' });
        cookies.set("REFRESH_TOKEN", refreshToken, { path: '/' });
        
        // Get current user info
        authUser.getCurrUser();
        navigate("/")
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.msg || err?.response?.data?.error;
      setError(apiMessage || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setInfo("");
    if (!userDetails.email) {
      setError("Please enter your email first to reset your password.");
      return;
    }
    setForgotSubmitting(true);
    try {
      const uri = `${import.meta.env.VITE_SERVER_URI}/user/forgot-password`;
      const { email } = userDetails;
      const res = await axios.post(uri, { email });
      const apiMessage = res?.data?.msg || "If an account exists for this email, a reset link will be sent.";
      setInfo(apiMessage);
    } catch (err) {
      const apiMessage = err?.response?.data?.msg || err?.response?.data?.error;
      setError(apiMessage || "Could not start password reset. Please try again.");
    } finally {
      setForgotSubmitting(false);
    }
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#58a6ff',
      },
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
              Login to Chess
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back! Enter your details to continue your match.
            </Typography>
          </Box>
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
            />
            {error && <Alert severity="error">{error}</Alert>}
            {info && <Alert severity="info">{info}</Alert>}
            <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>
              Sign In
            </Button>
          </form>
          <Divider flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              variant="text"
              size="small"
              onClick={handleForgotPassword}
              disabled={forgotSubmitting}
              sx={{ alignSelf: 'flex-start', textTransform: 'none', px: 0 }}
            >
              Forgot password?
            </Button>
            <Button variant="outlined" fullWidth onClick={() => navigate('/register')}>
              New? Sign Up
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialEmail = searchParams.get("email") || "";
  const initialToken = searchParams.get("token") || "";

  const [email, setEmail] = useState(initialEmail);
  const [token] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          primary: { main: "#58a6ff" },
          background: {
            default: "#05070f",
            paper: "rgba(20, 26, 38, 0.9)",
          },
        },
        components: {
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ffffff" },
                  "&:hover fieldset": { borderColor: "#ffffff" },
                  "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                },
                "& .MuiInputBase-input": { color: "#ffffff" },
                "& .MuiInputLabel-root": { color: "#ffffff" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" },
              },
            },
          },
        },
      }),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !token) {
      setError("Invalid reset link. Please request a new password reset email.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const uri = `${import.meta.env.VITE_SERVER_URI}/user/reset-password`;
      const res = await axios.post(uri, { email, token, newPassword });

      if (res.status === 200) {
        setSuccess("Password reset successful. You can now log in.");
        setTimeout(() => navigate("/login"), 900);
      } else {
        setError(res.data?.msg || res.data?.error || "Reset failed. Please try again.");
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.msg || err?.response?.data?.error;
      setError(apiMessage || "Reset failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: "relative",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: "96px",
          pb: 4,
          px: 2,
          bgcolor:
            "radial-gradient(circle at 20% 20%, rgba(88,166,255,0.08), transparent 25%), radial-gradient(circle at 80% 0%, rgba(88,166,255,0.06), transparent 22%), #05070f",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(2px)",
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />
        <Paper
          elevation={6}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 440,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            bgcolor: "background.paper",
            border: "1px solid rgba(88,166,255,0.18)",
            boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
            backdropFilter: "blur(16px)",
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center", textAlign: "center" }}>
            <Typography variant="h5" fontWeight={800}>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Set a new password for your account.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              type="email"
              autoComplete="email"
            />
            <TextField
              label="New Password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
              type="password"
              autoComplete="new-password"
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              type="password"
              autoComplete="new-password"
            />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>
              Reset Password
            </Button>
          </form>

          <Divider flexItem sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" fullWidth onClick={() => navigate("/login")}>
              Back to login
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}



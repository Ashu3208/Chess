import React, { useState } from "react";
import { Button, TextField, ThemeProvider, createTheme } from "@mui/material";
import axios from "axios"
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState({ email: "", password: "", username: "" })

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    // console.log(e.target.name)
    // console.log(userDetails)
  }

  const clearForm = () => {
    setUserDetails({ email: "", password: "", username: "" })
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const uri = `${import.meta.env.VITE_SERVER_URI}/user/signup`
    const { username, email, password } = userDetails
    axios.post(
      uri,
      {
        username, email, password
      }
    )
      .then((result) => { console.log(result); clearForm() })
      .catch((error) => { console.log(error) })


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

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit}>

        <TextField id="outlined-basic" label="Username" variant="outlined" name="username" value={userDetails.username} onChange={handleChange} />
        <TextField id="outlined-basic" label="Email" variant="outlined" name="email" value={userDetails.email} onChange={handleChange} />
        <TextField id="outlined-basic" label="Password" variant="outlined" name="password" value={userDetails.password} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      <Button onClick={()=>navigate('/login')}>Log In</Button>
    </ThemeProvider>
  );
}

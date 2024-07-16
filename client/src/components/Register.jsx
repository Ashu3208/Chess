import React, { useState, useContext } from "react";
import { Button, TextField, ThemeProvider, createTheme } from "@mui/material";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import UserContext from "../context/user";

export default function Register() {
  
  const navigate = useNavigate()
  const authUser = useContext(UserContext)
  const cookies = new Cookies()

  const [userDetails, setUserDetails] = useState({ email: "", password: "", username: "" })

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    // console.log(e.target.name)
    // console.log(userDetails)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uri = `${import.meta.env.VITE_SERVER_URI}/user/register`
    const { username, email, password } = userDetails
    const res = await axios.post(
      uri,
      {
        username, email, password
      }
    )
    if (res.status == 201) {
      cookies.set("TOKEN", res.data.token, { path: '/' })
      authUser.getCurrUser();
      navigate('/')
      // navigate(0)

    } else {
      console.log(res.data)
    }


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
        <Button type="submit">Submit</Button>
      </form>
      <Button onClick={() => navigate('/login')}>Log In</Button>
    </ThemeProvider>
  );
}

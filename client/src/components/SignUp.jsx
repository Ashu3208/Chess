import React, {useState} from "react";
import { TextField } from "@mui/material";
import axios from "axios"

export default function SignUp() {
 const [userDetails, setUserDetails] = useState({email:"",password:"",username:""})

  const handleChange = (e) =>{
    setUserDetails({...userDetails, [e.target.name]:e.target.value})
    // console.log(e.target.name)
    // console.log(userDetails)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const uri =  `${import.meta.env.VITE_SERVER_URI}/user/signup`
    axios.post(uri,{
      userDetails
    })
  };

  return (
    <div >
     <form onSubmit={handleSubmit}>
     <TextField id="outlined-basic" label="Username" variant="outlined" name="username" value={userDetails.username} onChange={handleChange} />
     <TextField id="outlined-basic" label="Email" variant="outlined" name="email" value={userDetails.email} onChange={handleChange} />
     <TextField id="outlined-basic" label="Password" variant="outlined" name="password" value={userDetails.password} onChange={handleChange} />
     <button type="submit">Submit</button>
     </form>
    </div>
  );
}
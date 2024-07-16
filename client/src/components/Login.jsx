import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import Cookies from  "universal-cookie";

export default function Login() {

    const navigate = useNavigate()
    const cookies = new Cookies()
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
                    navigate("/")
                }

            })
            .catch((error) => { console.log(error) })


    };

    return (
        <div >
            <form onSubmit={handleSubmit}>
                <TextField id="outlined-basic" label="Email" variant="outlined" name="email" value={userDetails.email} onChange={handleChange} />
                <TextField id="outlined-basic" label="Password" variant="outlined" name="password" value={userDetails.password} onChange={handleChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

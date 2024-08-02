import React, {useContext, useEffect} from "react";
import UserContext from "../context/user";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

export default function Play(){
    const currUser = useContext(UserContext)
    const navigate=useNavigate()
    useEffect(()=>{
        if(currUser.state.id==null){
            navigate('/login')
        }
    })  

    return(
       <Typography variant="h1" sx={{color:"white"}}>In development</Typography>
    )
}
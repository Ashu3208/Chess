import  {useContext, useEffect} from "react";
import UserContext from "../context/user";
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

  return (
      <div className="flex flex-1 text-white">
      <div>Profile</div>
      <div>Gameboard</div>
      <div>
        New Game
      </div>
      </div>
    )
}
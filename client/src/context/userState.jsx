import { useEffect, useState } from "react";
import axios from "axios";
import UserContext from "./user";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const BASE_URL = import.meta.env.VITE_SERVER_URI;

const UserStateProvider = (props) => {
  const [state, setState] = useState({
    id: null,
    username: null,
    email: null,
  });


  const getCurrUser = async () => {
    try {
      const token = cookies.get("TOKEN");
      const res = await axios.get(`${BASE_URL}/user/valid`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !==200) {
        const err = new Error(res.error);
        throw err;
      } else  {
        const { _id, username, email } = res.data;
        setState({
          ...state,
          id: _id,
          username,
          email
        });
       
      }
     
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCurrUser();
  }, []);

  return (
    <UserContext.Provider value={{ state, getCurrUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserStateProvider;
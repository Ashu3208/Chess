import { useEffect, useState } from "react";
import axiosInstance from "../utilities/axiosConfig";
import UserContext from "./user";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const UserStateProvider = (props) => {
  const [state, setState] = useState({
    id: null,
    username: null,
    email: null,
  });

  const getCurrUser = async () => {
    try {
      const accessToken = cookies.get("ACCESS_TOKEN");
      const refreshToken = cookies.get("REFRESH_TOKEN");

      // If no tokens at all, user is not logged in
      if (!accessToken && !refreshToken) {
        setState({
          id: null,
          username: null,
          email: null,
        });
        return;
      }

      // If we have refresh token but no access token (or expired), refresh it first
      if (refreshToken && !accessToken) {
        try {
          const BASE_URL = import.meta.env.VITE_SERVER_URI;
          const refreshResponse = await fetch(`${BASE_URL}/user/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const { accessToken: newAccessToken } = await refreshResponse.json();
            cookies.set("ACCESS_TOKEN", newAccessToken, { path: "/" });
          } else {
            // Refresh token is invalid/expired, clear everything
            cookies.remove("ACCESS_TOKEN", { path: "/" });
            cookies.remove("REFRESH_TOKEN", { path: "/" });
            setState({
              id: null,
              username: null,
              email: null,
            });
            return;
          }
        } catch (refreshErr) {
          // Refresh failed, clear tokens
          cookies.remove("ACCESS_TOKEN", { path: "/" });
          cookies.remove("REFRESH_TOKEN", { path: "/" });
          setState({
            id: null,
            username: null,
            email: null,
          });
          return;
        }
      }

      // Now try to get user info (axiosInstance will auto-refresh if needed)
      const res = await axiosInstance.get("/user/valid");

      if (res.status === 200) {
        const { _id, username, email } = res.data;
        setState({
          id: _id,
          username,
          email
        });
      }
    } catch (err) {
      // If error, clear user state
      console.log("Error fetching user:", err);
      setState({
        id: null,
        username: null,
        email: null,
      });
    }
  };

  const logout = async () => {
    try {
      const refreshToken = cookies.get("REFRESH_TOKEN");
      if (refreshToken) {
        // Call logout endpoint to revoke refresh token
        await axiosInstance.post("/user/logout", { refreshToken });
      }
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      // Clear tokens regardless of API call success
      cookies.remove("ACCESS_TOKEN", { path: "/" });
      cookies.remove("REFRESH_TOKEN", { path: "/" });
      setState({
        id: null,
        username: null,
        email: null,
      });
    }
  };

  useEffect(() => {
    getCurrUser();
  }, []);

  return (
    <UserContext.Provider value={{ state, getCurrUser, logout }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserStateProvider;
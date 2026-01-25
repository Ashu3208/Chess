import { Toolbar } from "@mui/material";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Toolbar />
      <Outlet />
    </>
  );
}

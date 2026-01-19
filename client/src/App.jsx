import GameBoard from "./components/GameBoard";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Play from "./components/Play";
import Layout from "./components/Layout";
import ResetPassword from "./components/ResetPassword";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@lichess-org/chessground/assets/chessground.cburnett.css";
import './styles.css'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "reset-password", element: <ResetPassword /> },
        { path: "game/:roomUrl", element: <GameBoard /> },
        { path: "play", element: <Play /> },
        {
          path: "*",
          element: (
            <p style={{ color: "white" }}>
              You have been lost. Click <a href="/">here</a> to return.{" "}
            </p>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

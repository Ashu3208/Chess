import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Layout from "./components/Layout";
import ResetPassword from "./components/ResetPassword";
import GameScreen from "./components/GameScreen";
import "./styles.css";

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
        { path: "game/:roomUrl", element: <GameScreen /> },
        { path: "play", element: <GameScreen /> },
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

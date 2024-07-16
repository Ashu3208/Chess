import React from 'react'
import GameBoard from './components/GameBoard'
import Home from './components/Home'
import { createBrowserRouter,RouterProvider, BrowserRouter as Router, Routes, Route} from "react-router-dom"
import SignUp from './components/SignUp'
import Login from './components/Login'
function App() {
  
  const router = createBrowserRouter([
    {
      path:'/',
      element: <Home />
    },
    {
      path:'/register',
      element: <SignUp />
    },
    {
      path:'/login',
      element: <Login />
    },
    {
      path:'/game/:roomUrl',
      element: (
        <div className="container">
          <GameBoard />
        </div>
      )
    }
  ])

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App

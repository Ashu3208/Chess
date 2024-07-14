import { useState } from 'react'
import GameBoard from './components/GameBoard'
import GamePopup from './components/GamePopup'
import SignInSide from './components/SignIn'
import Home from './components/Home'
import { createBrowserRouter,RouterProvider, BrowserRouter as Router, Routes, Route} from "react-router-dom"

function App() {
  
  const router = createBrowserRouter([
    {
      path:'/',
      element: <Home />
    },
    {
      path:'/signUp',
      element: (
        <div>Sign Up Page</div>
      )
    },
    {
      path:'/login',
      element: (
        <div>Log In Page</div>
      )
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

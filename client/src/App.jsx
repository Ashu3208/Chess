import React from 'react'
import GameBoard from './components/GameBoard'
import Home from './components/Home'
import { createBrowserRouter,RouterProvider, BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Register from './components/Register'
import Login from './components/Login'
import Play from './components/Play'

function App() {
  
  const router = createBrowserRouter([
    {
      path:'/',
      element: <Home />
    },
    {
      path:'/register',
      element: <Register />
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
    },
    {
      path:'/play',
      element:<Play />
    },
    {
      path:'/*',
      element:(<p style={{color:'white'}} >You have been lost. Click <a href='/'>here</a> to return. </p> )
    }
  ])

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App

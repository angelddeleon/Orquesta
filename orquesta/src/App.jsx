import React from 'react'
import { Route, Routes, BrowserRouter } from "react-router-dom"
import Login from  './pages/auth/login'
import Menu from './pages/menu/menu'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas independientes (no anidadas) */}
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
import React from 'react'
import { Route, Routes, BrowserRouter } from "react-router-dom"
import Login from  './pages/auth/login'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}>
          {/*<Route path="*" element={<NoPage />} />*/}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

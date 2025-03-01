import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './pages/auth/login'
import NewPartitura from './pages/partituras/newpartitura'
import Menu from './pages/menu/menu'
import Usuarios from "./pages/usuarios/usuarios"
import CrearUsuario from "./pages/usuarios/crearUsuario"
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/new_partitura" element={<NewPartitura />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/crear_usuario" element={<CrearUsuario />} />
                
                {/*<Route path="*" element={<NoPage />} />*/}
            </Routes>
        </BrowserRouter>
    )
}

export default App

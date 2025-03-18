import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './pages/auth/login'
import NewPartitura from './pages/partituras/newpartitura'
import Menu from './pages/menu/menu'
import Usuarios from "./pages/usuarios/usuarios"
import CrearUsuario from "./pages/usuarios/crearUsuario"
import Prestamo from './pages/prestamo/prestamo'
import EditarUsuario from './pages/usuarios/editarUsuario'
import EditarPartitura from './pages/partituras/editarPartitura'
import NotFound from './pages/404'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/new_partitura" element={<NewPartitura />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/editar_partitura/:id" element={<EditarPartitura />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/crear_usuario" element={<CrearUsuario />} />
                <Route path="/editar_usuario/:id" element={<EditarUsuario />} />
                <Route path="/prestamo" element={<Prestamo />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

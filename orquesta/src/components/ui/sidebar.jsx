import { useState, useEffect } from 'react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './css/sidebar.css'
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const navigate = useNavigate()

    const handleExit = async () => {
        const response = await fetch('https://backend.sinfocarabobo.com/api/usuarios/logout', {
            method: 'POST',
            credentials: 'include', // Para enviar cookies
        });
        
        const data = response.status === 200 ? true : false;

        if (data) {
            navigate('/')
            return
        }
    }

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth >= 768) {
                setIsOpen(false)
                document.body.classList.remove('body-no-scroll') // Limpiar al cambiar a desktop
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.classList.add('body-no-scroll')
        } else {
            document.body.classList.remove('body-no-scroll')
        }

        // Cleanup al desmontar
        return () => {
            document.body.classList.remove('body-no-scroll')
        }
    }, [isOpen, isMobile]) // Dependencias del efecto

    return (
        <>
            {/* Mobile Header */}
            <nav className="navbar d-md-none navbar-light bg-white border-bottom px-3">
                <button className="navbar-toggler" type="button" aria-label="Toggle navigation" onClick={() => setIsOpen(!isOpen)}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                {/* Logo */}
                <div className="sidebar-header text-center">
                    <img src="/brand/logo.webp" alt="Logo" className="img-fluid" style={{ maxWidth: '120px', width: '100%' }} />
                </div>
            </nav>

            {/* Desktop Sidebar */}
            <div className="d-none d-md-block col-md-2 vh-100 bg-white shadow-sm position-fixed">
                <div className="p-2 h-100 d-flex flex-column">
                    {/* Logo */}
                    <div className="sidebar-header text-center">
                        <img src="/brand/logo.webp" alt="Logo" className="img-fluid" style={{ maxWidth: '100px', width: '100%' }} />
                    </div>

                    <div className="flex-grow-1 mt-5">
                        <Link to="/menu" className="d-block text-dark text-decoration-none py-2">
                            <i className="fa-solid fa-music mx-2 "></i>
                            Partituras
                        </Link>

                        {
                            JSON.parse(localStorage.getItem('user')).role === 'admin' || JSON.parse(localStorage.getItem('user')).role === 'master' ? 
                            <Link to="/prestamo" className="d-block text-dark text-decoration-none py-2">
                                <i className="fa-solid fa-chart-column mx-2"></i>
                                Prestamo
                            </Link> : null
                        }
                        {
                            JSON.parse(localStorage.getItem('user')).role === 'admin' || JSON.parse(localStorage.getItem('user')).role === 'master' ? 
                            <Link to="/usuarios" className="d-block text-dark text-decoration-none py-2">
                            <i className="fa-solid fa-users mx-2"></i>
                            Usuarios
                            </Link>
                            : null    
                        }
                    </div>

                    <Link onClick={handleExit} className="text-danger text-decoration-none py-2 border-top">
                        <i className="fa fa-sign-out mx-2"></i>
                        Cerrar Sesión
                    </Link>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`offcanvas offcanvas-start ${isOpen ? 'show' : ''}`}
                style={{
                    visibility: isOpen ? 'visible' : 'hidden',
                    zIndex: 1045,
                    backgroundColor: 'white',
                }}>
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title">
                        <div className="fw-bold">Fundacion</div>
                        <div className="text-muted small">Orquesta Sinfónica de Carabobo</div>
                    </h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setIsOpen(false)}></button>
                </div>

                <div className="offcanvas-body p-0">
                    <Link to="/menu" className="d-block text-dark text-decoration-none px-4 py-3">
                        <i className="fa-solid fa-music mx-2"></i>
                        Partituras
                    </Link>
                    {
                            JSON.parse(localStorage.getItem('user')).role === 'admin' || JSON.parse(localStorage.getItem('user')).role === 'master' ? 
                        <Link to="/prestamo" className="d-block text-dark text-decoration-none px-4 py-3">
                                <i className="fa-solid fa-chart-column mx-2"></i>
                                Prestamo
                            </Link> : null
                        }
                    {
                            JSON.parse(localStorage.getItem('user')).role === 'admin' || JSON.parse(localStorage.getItem('user')).role === 'master' ? 
                        <Link to="/usuarios" className="d-block text-dark text-decoration-none px-4 py-3">
                            <i className="fa-solid fa-users mx-2"></i>
                            Usuarios
                        </Link> : null    
                        }
                </div>
                <Link onClick={handleExit} className="d-block text-danger text-decoration-none px-4 py-3">
                    <i className="fa fa-sign-out mx-2"></i>
                    Cerrar Sesión
                </Link>
            </div>
            {/* Backdrop dinámico */}
            {isOpen && isMobile && (
                <div
                    className="offcanvas-backdrop fade show"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: 1040,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}

export default Sidebar

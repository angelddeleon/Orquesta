import React from 'react';
import Layout from '../../layout/layout';
import './styles/login.css'; // Importa el archivo CSS

export default function Login() {
    return (
        <Layout>
            <div className="h-100 w-100 d-flex justify-content-center align-items-start pt-5">
                {/* Contenedor con ancho responsive */}
                <div className="container text-center w-100 w-lg-25 p-3">
                    {/* Imagen responsive */}
                    <img 
                        src="/brand/logo.webp" 
                        alt="Logo" 
                        className="img-fluid mb-2" // Margen inferior reducido
                        style={{ maxWidth: '150px', height: 'auto', marginTop: '-20px' }} // Mover la imagen hacia arriba
                    />

                    {/* Título */}
                    <h1 className="mb-4">Bienvenido de nuevo</h1>

                    {/* Formulario */}
                    <form action="/login" method="POST">
                        {/* Input de correo electrónico */}
                        <input 
                            type="email" 
                            className="form-control mb-3" 
                            placeholder="Ingrese su correo electrónico" 
                        />

                        {/* Input de contraseña */}
                        <input 
                            type="password" 
                            className="form-control mb-3" 
                            placeholder="Ingrese su contraseña" 
                        />

                        {/* Botón de enviar */}
                        <button 
                            className="btn btn-primary w-100 rounded-pill py-2"
                        >
                            Iniciar Sesion
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
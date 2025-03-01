import React from 'react';
import './styles/login.css';

export default function Login() {
    return (
        <main className="d-flex vh-100 vw-100">
            {/* Segundo div (50% del ancho en pantallas grandes, 100% en móviles) */}
            <div 
                id='loginBackground' 
                className="w-100 w-md-100 h-100 d-flex justify-content-center align-items-center d-none d-md-flex"
            >
                {/* Contenido del segundo div (puedes agregar una imagen o texto aquí) */}
            </div>

            {/* Primer div (50% del ancho en pantallas grandes, 100% en móviles) */}
            <div id='login' className="w-100 w-lg-50 bg-primary h-100 d-flex justify-content-center align-items-center">
                <div className="text-center w-90 w-lg-25 p-3">
                    {/* Imagen responsive */}
                    <img 
                        src="/brand/logo.webp" 
                        alt="Logo" 
                        className="img-fluid mb-2" 
                        style={{ maxWidth: '150px', height: 'auto' }} 
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
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
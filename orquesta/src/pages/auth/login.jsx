import React from 'react';
import './styles/login.css';
import { ToastContainer, toast } from 'react-toastify';
import ExpansiveToast from '../../components/ui/expansiveToast';

export default function Login() {
    async function handleSubmit(event) {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;

        await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json(); // Devuelve la promesa para el siguiente .then
                } else {
                    // Muestra el toast de error y detiene la ejecución
                    toast.error(
                        <ExpansiveToast
                            title="Credenciales Invalidas"
                            content={
                                <>
                                    <p className="mb-2 fs-6">
                                        Ingrese nuevamente las credenciales para validar el sistema
                                    </p>
                                </>
                            }
                        />,
                        {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                        }
                    );
                    return Promise.reject('Credenciales inválidas'); // Detiene la cadena de promesas
                }
            })
            .then((data) => {
                window.localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/menu'; // Redirige al usuario a la página principal
            })
            .catch((error) => {
                //Error del Servidor
                console.error('Error:', error);
            });
    }

    return (
        <main className="d-flex vh-100 vw-100">
            {/* Segundo div (50% del ancho en pantallas grandes, 100% en móviles) */}
            <div
                id="loginBackground"
                className="w-100 w-md-100 h-100 d-flex justify-content-center align-items-center d-none d-md-flex"
            >
                {/* Contenido del segundo div (puedes agregar una imagen o texto aquí) */}
            </div>

            {/* Primer div (50% del ancho en pantallas grandes, 100% en móviles) */}
            <div
                id="login"
                className="w-100 w-lg-50 h-100 d-flex justify-content-center align-items-center"
            >
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
                    <form onSubmit={handleSubmit}>
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
                        <button className="btn btn-primary w-100 rounded-pill py-2">
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </main>
    );
}
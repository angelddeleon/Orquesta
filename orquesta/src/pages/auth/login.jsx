import React, { useState } from 'react';
import './styles/login.css';
import { ToastContainer, toast } from 'react-toastify';
import ExpansiveToast from '../../components/ui/expansiveToast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Validación de formulario
    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = "El correo electrónico es requerido";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "El correo electrónico no es válido";
        }

        if (!password) {
            newErrors.password = "La contraseña es requerida";
        } else if (password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Enviar formulario
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            try {
                // Enviar los datos al backend
                const response = await fetch('https://backend.sinfocarabobo.com/api/usuarios/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, contraseña: password }), // Enviar email y contraseña
                    credentials: 'include'  // Incluir las cookies en la solicitud
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al iniciar sesión');
                }

                const data = await response.json();

                // Guardar el token en el localStorage
                if (data.user) {
                    const userData = {
                        id: data.user.id,
                        nombre: data.user.nombre,
                        email: data.user.email,
                        role: data.user.role,
                    };

                    // Guardar todo en localStorage
                    localStorage.setItem('user', JSON.stringify(userData));

                    // Redirigir a la página principal
                    navigate('/menu');
                } else {
                    throw new Error('Usuario no recibido');
                }

            } catch (error) {
                console.error('Error:', error);
                setErrors({ submit: error.message });
            }
        } else {
            console.log('Formulario inválido. Corrige los errores.');
        }
    };

    return (
        <main className="d-flex vh-100 vw-100">
            <div
                id="loginBackground"
                className="w-100 w-md-100 h-100 d-flex justify-content-center align-items-center d-none d-md-flex"
            />
            <div
                id="login"
                className="w-100 w-lg-50 h-100 d-flex justify-content-center align-items-center"
            >
                <div className="text-center w-90 w-lg-25 p-3">
                    <img
                        src="/brand/logo.webp"
                        alt="Logo"
                        className="img-fluid mb-2"
                        style={{ maxWidth: '150px', height: 'auto' }}
                    />
                    <h1 className="mb-4">Bienvenido de nuevo</h1>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            className="form-control mb-3"
                            placeholder="Ingrese su correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-red-500">{errors.email}</p>}

                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <p className="text-red-500">{errors.password}</p>}

                        <button className="btn btn-primary w-100 rounded-pill py-2">
                            Iniciar Sesión
                        </button>
                    </form>
                    {errors.submit && <p className="text-red-500">{errors.submit}</p>}
                </div>
            </div>
            <ToastContainer />
        </main>
    );
}

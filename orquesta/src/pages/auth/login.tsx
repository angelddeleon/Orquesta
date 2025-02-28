import React from 'react';
import Layout from '../../layout/layout';

export default function Login() {
    return (
        <Layout>
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <div className="container text-center w-25">
                    <img src='../../assets/brand/logo.webp' alt="Logo" className="image" />
                    <h1 className="mb-4">Bienvenido de nuevo</h1>
                    <input type="email" className="form-control mb-3" placeholder="Ingrese su correo electrónico" />
                    <input type="password" className="form-control mb-3" placeholder="Ingrese su contraseña" />
                    <button className="btn btn-primary w-100 rounded-full">Enviar</button>
                </div>
            </div>
        </Layout>
    );
}
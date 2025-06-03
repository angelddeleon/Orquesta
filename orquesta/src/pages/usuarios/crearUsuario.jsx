import React, { useState, useEffect } from 'react';
import Layout from '../../layout/layout';
import { Link, useNavigate } from 'react-router-dom';

export default function UserForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        contrasena: '',
        role: 'archivista',
        telefono: '',
        codigoPais: '+58'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("user")).role !== "admin"  && JSON.parse(localStorage.getItem('user')).role !== 'master') {
            console.log(JSON.parse(localStorage.getItem("user")).role !== "admin")
            window.location.href = "/";
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://backend.sinfocarabobo.com/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    email: formData.email // Aseguramos que se envíe como email
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Usuario creado exitosamente');
                navigate('/usuarios');
            } else {
                alert('Error: ' + (data.error || 'Error al crear el usuario'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear el usuario');
        }
    };

    return (
        <Layout>
            <div className="d-flex vh-100">
                <div className="main-content flex-grow-1 p-4" style={{ width: '80%' }}>
                    <div className="text-center mb-4">
                        <h5 className="text-primary mb-2">ORQUESTA SINFONICA DE CARABOBO</h5>
                        <h1 className="mb-3">Crear un Usuario</h1>
                        <p className="text-muted">Rellene todo el siguiente formulario y una vez finalizado presione el boton</p>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        name="nombre"
                                        placeholder="David"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="ejemplo@correo.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-3">
                                        <label htmlFor="codigoPais" className="form-label">
                                            Código de País
                                        </label>
                                        <select
                                            className="form-select"
                                            id="codigoPais"
                                            name="codigoPais"
                                            value={formData.codigoPais}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="+58">Venezuela (+58)</option>
                                            <option value="+1">USA/Canadá (+1)</option>
                                            <option value="+52">México (+52)</option>
                                            <option value="+34">España (+34)</option>
                                            <option value="+54">Argentina (+54)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-9">
                                        <label htmlFor="telefono" className="form-label">
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="telefono"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            required
                                            maxLength={7}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="contrasena" className="form-label">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="contrasena"
                                        name="contrasena"
                                        placeholder="123456789"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="role" className="form-label">Role</label>
                                    <select
                                        id="role"
                                        name="role"
                                        className="form-control"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="archivista">Archivista</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn py-2" style={{ backgroundColor: '#d4b52c', color: 'white' }}>
                                        Crear Usuario
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

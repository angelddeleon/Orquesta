import React, { useState } from 'react';
import Layout from '../../layout/layout';
import { Link ,useNavigate} from 'react-router-dom';

export default function UserForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        contrasena: '',
        role: 'archivero',  // Establecemos 'archivero' por defecto
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Enviar los datos al servidor
        const response = await fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Usuario creado exitosamente');
            navigate('/usuarios');
        } else {
            alert('Error: ' + data.error);
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
                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label htmlFor="nombre" className="form-label">
                                            Nombre
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
                                    <div className="col-md-6">
                                        <label htmlFor="apellido" className="form-label">
                                            Apellido
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="apellido"
                                            name="apellido"
                                            placeholder="Lopez"
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="correo" className="form-label">
                                        Correo
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="correo"
                                        name="correo"
                                        placeholder="Bethovenludwig@gmail.com"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        required
                                    />
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

                                {/* Selector de Roles */}
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
                                        <option value="archivero">Archivero</option>
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

import React from 'react'
import { useState } from 'react'
import Layout from '../../layout/layout'
import { Link } from 'react-router-dom'

export default function EditarUsuario() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        contrasena: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Datos del formulario:', formData)
        // Aquí iría la lógica para enviar los datos al servidor
    }

    return (
        <Layout>
            <div className="d-flex vh-100">
               

                {/* Contenido principal - 80% del ancho */}
                <div className="main-content flex-grow-1 p-4" style={{ width: '80%' }}>
                    <div className="text-center mb-4">
                        <h5 className="text-primary mb-2">ORQUESTA SINFONICA DE CARABOBO</h5>
                        <h1 className="mb-3">Editar un Usuario</h1>
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

                                <div className="d-grid">
                                    <button type="submit" className="btn py-2" style={{ backgroundColor: '#d4b52c', color: 'white' }}>
                                        Editar Usuario
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

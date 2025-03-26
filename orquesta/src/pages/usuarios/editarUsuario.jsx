import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layout/layout';

export default function EditarUsuario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        codigoPais: '+58'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener datos del usuario al cargar el componente
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/usuarios/${id}`);
                
                if (!response.ok) {
                    throw new Error('Usuario no encontrado');
                }

                const data = await response.json();
                
                setFormData({
                    nombre: data.nombre || '',
                    email: data.email || '',
                    telefono: data.telefono || '',
                    codigoPais: data.codigoPais || '+58'
                });
                
                setLoading(false);
            } catch (err) {
                console.error('Error al obtener usuario:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsuario();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }

            alert('Usuario actualizado correctamente');
            navigate('/usuarios'); // Redirigir al listado después de editar
        } catch (err) {
            console.error('Error al actualizar:', err);
            alert('Error al actualizar el usuario');
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="alert alert-danger">
                        {error} - <Link to="/usuarios" className="alert-link">Volver al listado</Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="d-flex vh-100">
                <div className="main-content flex-grow-1 p-4" style={{ width: '80%' }}>
                    <div className="text-center mb-4">
                        <h5 className="text-primary mb-2">ORQUESTA SINFONICA DE CARABOBO</h5>
                        <h1 className="mb-3">Editar Usuario</h1>
                        <p className="text-muted">Complete el formulario y presione el botón para guardar los cambios</p>
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

                                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary me-md-2"
                                        onClick={() => navigate('/usuarios')}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        style={{ backgroundColor: '#d4b52c', borderColor: '#d4b52c' }}
                                    >
                                        Guardar Cambios
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
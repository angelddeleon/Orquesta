import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../layout/layout';

export default function EditarPartitura() {
    const { id } = useParams(); // Obtén el id de los parámetros de la URL
    const [formData, setFormData] = useState({
        obra: '',
        archivero: '',
        caja: '',
        compositor: '',
        arreglista: '',
        orquestacion: '',
        originales: '',
        copias: '',
        categoria: '',
        score: '',
        observaciones: '',
    });

    // Función para obtener los datos de la partitura
    useEffect(() => {
        const fetchPartitura = async () => {
            try {
                const response = await fetch(`http://localhost:3000/partituras/${id}`); // Ajusta la URL según tu API
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de la partitura');
                }
                const data = await response.json();
                setFormData(data); // Rellena el formulario con los datos de la partitura
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchPartitura();
    }, [id]); // Ejecuta este efecto cuando el id cambie

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/partituras/${id}`, {
                method: 'PUT', // Usa PUT para actualizar la partitura
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar la partitura');
            }
            alert('Partitura actualizada correctamente');
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al actualizar la partitura');
        }
    };

    return (
        <Layout>
            <div className="d-flex vh-100">
                {/* Contenido principal - 80% del ancho */}
                <div className="main-content flex-grow-1 p-4" style={{ width: '80%' }}>
                    <div className="text-center mb-4">
                        <h5 className="text-primary mb-2">ORQUESTA SINFONICA DE CARABOBO</h5>
                        <h1 className="mb-3">Editar Partitura</h1>
                        <p className="text-muted">Rellene todo el siguiente formulario y una vez finalizado presione el botón</p>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label htmlFor="obra" className="form-label">
                                            Obra
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="obra"
                                            name="obra"
                                            placeholder="Nombre de la obra"
                                            value={formData.obra}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="archivero" className="form-label">
                                            Archivero
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="archivero"
                                            name="archivero"
                                            placeholder="Nombre del archivero"
                                            value={formData.archivero}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label htmlFor="caja" className="form-label">
                                            Caja
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="caja"
                                            name="caja"
                                            placeholder="Número de caja"
                                            value={formData.caja}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="compositor" className="form-label">
                                            Compositor
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="compositor"
                                            name="compositor"
                                            placeholder="Nombre del compositor"
                                            value={formData.compositor}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label htmlFor="arreglista" className="form-label">
                                            Arreglista
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="arreglista"
                                            name="arreglista"
                                            placeholder="Nombre del arreglista"
                                            value={formData.arreglista}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="orquestacion" className="form-label">
                                            Orquestación
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="orquestacion"
                                            name="orquestacion"
                                            placeholder="Tipo de orquestación"
                                            value={formData.orquestacion}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label htmlFor="originales" className="form-label">
                                            Originales
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="originales"
                                            name="originales"
                                            placeholder="Número de originales"
                                            value={formData.originales}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="copias" className="form-label">
                                            Copias
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="copias"
                                            name="copias"
                                            placeholder="Número de copias"
                                            value={formData.copias}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label htmlFor="categoria" className="form-label">
                                            Categoría
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="categoria"
                                            name="categoria"
                                            placeholder="Categoría de la partitura"
                                            value={formData.categoria}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="score" className="form-label">
                                            Score
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="score"
                                            name="score"
                                            placeholder="Score de la partitura"
                                            value={formData.score}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="observaciones" className="form-label">
                                        Observaciones
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="observaciones"
                                        name="observaciones"
                                        placeholder="Observaciones adicionales"
                                        value={formData.observaciones}
                                        onChange={handleChange}
                                        rows="3"
                                    ></textarea>
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn py-2" style={{ backgroundColor: '#d4b52c', color: 'white' }}>
                                        Editar Partitura
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
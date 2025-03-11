import React, { useState, useEffect } from 'react';
import Layout from '../../layout/layout';
import { Link } from 'react-router-dom';
import './styles/menu.css';

export default function Menu() {
    const [partituras, setPartituras] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    // Obtener datos del backend
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/partituras?page=${currentPage}&limit=${itemsPerPage}`);
            const { data, total } = await response.json();
            setPartituras(data);
            setTotalPages(Math.ceil(total / itemsPerPage));
        };
        fetchData();
    }, [currentPage, itemsPerPage]);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Layout>
            {/* Contenido principal - 80% del ancho */}
            <div className="main-content p-4">
                {/* Header con título y botones */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Partituras</h1>
                    <div className="d-flex gap-2">
                        <button className="btn btn-primary">
                            <i className="fa-solid fa-arrow-up me-2"></i>
                            Imprimir
                        </button>
                        <button className="btn btn-blue">
                            <Link to="/new_partitura" className="text-white text-decoration-none">
                                + Crear Partitura
                            </Link>
                        </button>
                    </div>
                </div>

                {/* Barra de búsqueda y filtro */}
                <div className="d-flex justify-content-between mb-4">
                    <div className="input-group" style={{ maxWidth: '400px' }}>
                        <span className="input-group-text">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </span>
                        <input type="text" className="form-control" placeholder="Buscar partituras..." />
                    </div>
                    <button className="btn btn-outline-secondary">
                        <i className="fa-solid fa-filter me-2"></i>
                        Filtrar
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Obra</th>
                                <th>Archivero</th>
                                <th>Caja</th>
                                <th>Compositor</th>
                                <th>Arreglista</th>
                                <th>Orquestación</th>
                                <th>Originales</th>
                                <th>#</th>
                                <th>Copias</th>
                                <th>#</th>
                                <th>Categoría</th>
                                <th>Score</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partituras.map((partitura, index) => (
                                <tr key={index}>
                                    <td>{partitura.obra}</td>
                                    <td>{partitura.archivero}</td>
                                    <td>{partitura.caja}</td>
                                    <td>{partitura.compositor}</td>
                                    <td>{partitura.arreglista}</td>
                                    <td>{partitura.orquestacion}</td>
                                    <td>{partitura.originales}</td>
                                    <td>{partitura.originales}</td>
                                    <td>{partitura.copias}</td>
                                    <td>{partitura.copias}</td>
                                    <td>{partitura.categoria}</td>
                                    <td>{partitura.score}</td>
                                    <td>{partitura.observaciones}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Controles de paginación */}
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage - 1)}
                            >
                                Anterior
                            </button>
                        </li>
                        {[...Array(totalPages).keys()].map((number) => (
                            <li
                                key={number + 1}
                                className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => paginate(number + 1)}
                                >
                                    {number + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage + 1)}
                            >
                                Siguiente
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </Layout>
    );
}
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/layout";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    // Obtener datos del backend
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                `http://localhost:3000/api/usuarios?page=${currentPage}&limit=${itemsPerPage}`
            );
            const { data, total } = await response.json();
            setUsuarios(data);
            setTotalPages(Math.ceil(total / itemsPerPage));
        };
        fetchData();
    }, [currentPage, itemsPerPage]);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Layout>
            <div className="d-flex vh-100">
                {/* Contenido principal - 80% del ancho */}
                <div className="main-content flex-grow-1 p-4" style={{ width: "80%" }}>
                    {/* Header con título y botones */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Usuarios</h1>
                        <div className="d-flex gap-2">
                            <Link to="/crear_usuario" className="btn btn-blue">
                                + Crear Usuario
                            </Link>
                        </div>
                    </div>

                    {/* Barra de búsqueda y filtro */}
                    <div className="d-flex justify-content-between mb-4">
                        <div className="input-group" style={{ maxWidth: "400px" }}>
                            <span className="input-group-text">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar usuario..."
                            />
                        </div>
                        <button className="btn btn-outline-secondary">
                            <i className="fa-solid fa-filter me-2"></i>
                            Filtrar
                        </button>
                    </div>

                    {/* Tabla de usuarios */}
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Correo</th>
                                    <th>Role</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usuario, index) => (
                                    <tr key={index}>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.apellido}</td>
                                        <td>{usuario.correo}</td>
                                        <td>{usuario.role}</td>
                                        <td>
                                            <Link to={`/editar_usuario/${usuario.id}`} className="btn btn-sm btn-primary">
                                                Editar
                                            </Link>
                                        </td>
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
            </div>
        </Layout>
    );
}
import React, { useState, useEffect } from 'react';
import Layout from '../../layout/layout';
import { Link } from 'react-router-dom';
import './styles/menu.css';

export default function Menu() {
    const [partituras, setPartituras] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [showFilters, setShowFilters] = useState(false); // Estado para mostrar/ocultar el panel de filtros
    const [filters, setFilters] = useState({
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
    }); // Estado para almacenar los filtros

    // Obtener datos del backend (comentado y reemplazado por datos de prueba)
    useEffect(() => {
        /*
        const fetchData = async () => {
            const response = await fetch(`/api/partituras?page=${currentPage}&limit=${itemsPerPage}`);
            const { data, total } = await response.json();
            setPartituras(data);
            setTotalPages(Math.ceil(total / itemsPerPage));
        };
        fetchData();
        */

        // Datos de prueba
        const dataDePrueba = [
            {
                id: 1,
                obra: "Sinfonía No. 5",
                archivero: "Juan Pérez",
                caja: "Caja 1",
                compositor: "Ludwig van Beethoven",
                arreglista: "N/A",
                orquestacion: "Completa",
                originales: 1,
                copias: 5,
                categoria: "Clásica",
                score: "Partitura completa",
                observaciones: "En buen estado",
            },
            {
                id: 2,
                obra: "El Lago de los Cisnes",
                archivero: "María López",
                caja: "Caja 2",
                compositor: "Pyotr Ilyich Tchaikovsky",
                arreglista: "N/A",
                orquestacion: "Completa",
                originales: 1,
                copias: 3,
                categoria: "Ballet",
                score: "Partitura completa",
                observaciones: "Requiere restauración",
            },
            {
                id: 3,
                obra: "Carmen",
                archivero: "Carlos Gómez",
                caja: "Caja 3",
                compositor: "Georges Bizet",
                arreglista: "N/A",
                orquestacion: "Completa",
                originales: 1,
                copias: 7,
                categoria: "Ópera",
                score: "Partitura completa",
                observaciones: "Falta una página",
            },
        ];

        setPartituras(dataDePrueba);
        setTotalPages(Math.ceil(dataDePrueba.length / itemsPerPage));
    }, [currentPage, itemsPerPage]);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Función para manejar cambios en los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Función para limpiar los filtros
    const clearFilters = () => {
        setFilters({
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
    };

    // Función para filtrar las partituras
    const filteredPartituras = partituras.filter((partitura) => {
        return (
            (filters.obra ? partitura.obra.includes(filters.obra) : true) &&
            (filters.archivero ? partitura.archivero.includes(filters.archivero) : true) &&
            (filters.caja ? partitura.caja.includes(filters.caja) : true) &&
            (filters.compositor ? partitura.compositor.includes(filters.compositor) : true) &&
            (filters.arreglista ? partitura.arreglista.includes(filters.arreglista) : true) &&
            (filters.orquestacion ? partitura.orquestacion.includes(filters.orquestacion) : true) &&
            (filters.originales ? partitura.originales.toString().includes(filters.originales) : true) &&
            (filters.copias ? partitura.copias.toString().includes(filters.copias) : true) &&
            (filters.categoria ? partitura.categoria.includes(filters.categoria) : true) &&
            (filters.score ? partitura.score.includes(filters.score) : true) &&
            (filters.observaciones ? partitura.observaciones.includes(filters.observaciones) : true)
        );
    });

    // Calcular los usuarios a mostrar en la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPartituras.slice(indexOfFirstItem, indexOfLastItem);

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
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar partituras..."
                            value={filters.obra}
                            onChange={(e) => setFilters({ ...filters, obra: e.target.value })}
                        />
                    </div>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <i className="fa-solid fa-filter me-2"></i>
                        Filtrar
                    </button>
                </div>

                {/* Panel de filtros */}
                {showFilters && (
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Filtros</h5>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="obra" className="form-label">Obra</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="obra"
                                        name="obra"
                                        value={filters.obra}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="archivero" className="form-label">Archivero</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="archivero"
                                        name="archivero"
                                        value={filters.archivero}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="caja" className="form-label">Caja</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="caja"
                                        name="caja"
                                        value={filters.caja}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="compositor" className="form-label">Compositor</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="compositor"
                                        name="compositor"
                                        value={filters.compositor}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="arreglista" className="form-label">Arreglista</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="arreglista"
                                        name="arreglista"
                                        value={filters.arreglista}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="orquestacion" className="form-label">Orquestación</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="orquestacion"
                                        name="orquestacion"
                                        value={filters.orquestacion}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="originales" className="form-label">Originales</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="originales"
                                        name="originales"
                                        value={filters.originales}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="copias" className="form-label">Copias</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="copias"
                                        name="copias"
                                        value={filters.copias}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="categoria" className="form-label">Categoría</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="categoria"
                                        name="categoria"
                                        value={filters.categoria}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="score" className="form-label">Score</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="score"
                                        name="score"
                                        value={filters.score}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="observaciones" className="form-label">Observaciones</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="observaciones"
                                        name="observaciones"
                                        value={filters.observaciones}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <button className="btn btn-secondary me-2" onClick={clearFilters}>
                                    Limpiar Filtros
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabla de partituras */}
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
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((partitura, index) => (
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
                                    <td className="align-middle">
                                        <Link to={`/editar_partitura/${partitura.id}`} className="btn btn-sm btn-primary">
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
                        {[...Array(Math.ceil(filteredPartituras.length / itemsPerPage)).keys()].map((number) => (
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
                        <li className={`page-item ${currentPage === Math.ceil(filteredPartituras.length / itemsPerPage) ? 'disabled' : ''}`}>
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
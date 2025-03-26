import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/layout";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
    const [showFilters, setShowFilters] = useState(false); // Estado para mostrar/ocultar el panel de filtros
    const [filters, setFilters] = useState({
        role: "",
    }); // Estado para almacenar los filtros

    // Obtener datos del backend (simulado)
    useEffect(() => {
        // Conexion con Backend
        const fetchData = async () => {
            const response = await fetch(
                `http://localhost:3000/api/usuarios/`
            );
            const data = await response.json();
            setUsuarios(data);
        };
        fetchData();
    }, []);

    // Función para filtrar usuarios
    const filteredUsuarios = usuarios?.filter((usuario) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = (
            usuario.nombre.toLowerCase().includes(searchLower) ||
            usuario.email.toLowerCase().includes(searchLower) ||
            usuario.telefono.toLowerCase().includes(searchLower) ||
            usuario.role.toLowerCase().includes(searchLower)
        );
        const matchesRole = filters.role ? usuario.role === filters.role : true;
        return matchesSearch && matchesRole;
    });

    // Manejar cambios en los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Limpiar filtros
    const clearFilters = () => {
        setFilters({
            role: "",
        });
    };

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
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                    <div className="col-md-4">
                                        <label htmlFor="role" className="form-label">
                                            Role
                                        </label>
                                        <select
                                            className="form-select"
                                            id="role"
                                            name="role"
                                            value={filters.role}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">Todos</option>
                                            <option value="admin">Admin</option>
                                            <option value="archivero">Empleado</option>
                                        </select>
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

                    {/* Tabla de usuarios */}
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsuarios?.map((usuario, index) => (
                                    <tr key={index}>
                                        <td className="align-middle">{usuario.nombre}</td>
                                        <td className="align-middle">{usuario.email}</td>
                                        <td className="align-middle">{usuario.telefono}</td>
                                        <td className="align-middle">{usuario.role}</td>
                                        {usuario.role === "admin" ? (
                                            <td className="align-middle"></td>
                                        ) : (
                                            <td className="align-middle">
                                                <Link to={`/editar_usuario/${usuario.id}`} className="btn btn-sm btn-primary">
                                                    Editar
                                                </Link>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
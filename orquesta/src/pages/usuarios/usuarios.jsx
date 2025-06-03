import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/layout";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        role: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const [currentUserRole, setCurrentUserRole] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null); // Estado para el ID del usuario actual

    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || (user.role !== "admin" && user.role !== "master")) {
                window.location.href = "/";
                return;
            }
            setCurrentUserRole(user.role);
            setCurrentUserId(user.id); // Almacenar el ID del usuario actual

            const response = await fetch(
                `https://backend.sinfocarabobo.com/api/usuarios/`, { credentials: 'include' }
            );
            const usuariosData = await response.json();
            setUsuarios(usuariosData);
        };
        fetchData();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            try {
                const response = await fetch(`https://backend.sinfocarabobo.com/api/usuarios/${userId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                
                if (response.ok) {
                    setUsuarios(usuarios.filter(usuario => usuario.id !== userId));
                } else {
                    alert('Error al eliminar el usuario');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar el usuario');
            }
        }
    };

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

    // Calcular paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsuarios?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsuarios?.length / itemsPerPage);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
        setCurrentPage(1); // Resetear a la primera página al cambiar filtros
    };

    const clearFilters = () => {
        setFilters({
            role: "",
        });
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Función para determinar si se pueden mostrar las acciones (editar y eliminar)
    const canPerformActions = (usuarioId, userRole) => {
        // Si el usuario de la fila es el mismo que el usuario logeado, no se pueden realizar acciones.
        if (usuarioId === currentUserId) {
            return false;
        }

        // Lógica existente para permisos de edición/eliminación
        if (currentUserRole === "master") {
            return true; // Master puede editar/eliminar a todos excepto a sí mismo (ya manejado arriba)
        } else if (currentUserRole === "admin") {
            return userRole !== "admin" && userRole !== "master"; // Admin solo puede editar/eliminar usuarios normales
        }
        return false;
    };

    return (
        <Layout>
            <div className="d-flex vh-100">
                <div className="main-content flex-grow-1 p-4" style={{ width: "80%" }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Usuarios</h1>
                        {currentUserRole === "master" || currentUserRole === "admin" && (
                            <Link to="/crear_usuario" className="btn btn-blue">
                                + Crear Usuario
                            </Link>
                        )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="input-group" style={{ maxWidth: "300px" }}>
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
                                            <option value="master">Master</option>
                                            <option value="archivista">Empleado</option>
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
                                {currentItems?.map((usuario, index) => (
                                    <tr key={index}>
                                        <td className="align-middle">{usuario.nombre}</td>
                                        <td className="align-middle">{usuario.email}</td>
                                        <td className="align-middle">{usuario.telefono}</td>
                                        <td className="align-middle">{usuario.role}</td>
                                        <td className="align-middle d-flex align-items-center justify-content-center h-100"> {/* Añadido d-flex, align-items-center, justify-content-center, h-100 */}
                                            {canPerformActions(usuario.id, usuario.role) ? (
                                                <div className="d-flex gap-2">
                                                    <Link 
                                                        to={`/editar_usuario/${usuario.id}`} 
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(usuario.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-muted">No disponible</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <nav className="mt-4">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                    Anterior
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => paginate(currentPage + 1)}>
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
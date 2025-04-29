import React, { useState, useEffect } from "react";
import Layout from "../../layout/layout";
import { Link } from "react-router-dom";

export default function Prestamo() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    obra: "",
    caja: "",
    entrego: "",
    recibio: "",
    actual: "",
    estado: ""
  });

  // Obtener préstamos desde la API
  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://backend.sinfocarabobo.com/api/prestamos',{credentials: 'include'});
        if (!response.ok) {
          throw new Error('Error al obtener los préstamos');
        }
        const data = await response.json();
        setPrestamos(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, []);

  // Función para marcar como devuelto
  const marcarComoDevuelto = async (id) => {
    try {
      const response = await fetch(`https://backend.sinfocarabobo.com/api/prestamos/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ estado: 'devuelto' })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      // Actualizar el estado local en lugar de recargar la página
      setPrestamos(prevPrestamos => 
        prevPrestamos.map(prestamo => 
          prestamo.id === id ? {...prestamo, estado: 'devuelto'} : prestamo
        )
      );
    } catch (error) {
      console.error("Error al marcar como devuelto:", error);
      alert('Error al marcar como devuelto');
    }
  };

  // Filtrar préstamos
  const filteredPrestamos = prestamos.filter(prestamo => {
    return (
      prestamo.obra.toLowerCase().includes(filters.obra.toLowerCase()) &&
      prestamo.caja.toLowerCase().includes(filters.caja.toLowerCase()) &&
      prestamo.entrego.toLowerCase().includes(filters.entrego.toLowerCase()) &&
      prestamo.recibio.toLowerCase().includes(filters.recibio.toLowerCase()) &&
      prestamo.actual.toLowerCase().includes(filters.actual.toLowerCase()) &&
      (filters.estado === "" || prestamo.estado.toLowerCase() === filters.estado.toLowerCase())
    );
  });

  // Calcular páginas
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrestamos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrestamos.length / itemsPerPage);

  const clearFilters = () => {
    setFilters({
      obra: "",
      caja: "",
      entrego: "",
      recibio: "",
      actual: "",
      estado: ""
    });
  };

  return (
    <Layout>
      <div className="main-content p-4 ms-2">
        {/* Header con título y botones */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Préstamos</h1>
          <div className="d-flex gap-2">
            <button className="btn btn-blue">
              <Link
                to="/prestamo/nuevo_prestamo"
                className="text-white text-decoration-none"
              >
                + Agregar Préstamo
              </Link>
            </button>
          </div>
        </div>

        {/* Barra de búsqueda y filtro */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          {!showFilters && (
            <div className="input-group" style={{ maxWidth: "400px" }}>
              <span className="input-group-text">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar Obra..."
                value={filters.obra}
                onChange={(e) =>
                  setFilters({ ...filters, obra: e.target.value })
                }
              />
            </div>
          )}

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary d-flex align-items-center"
              onClick={() => setShowFilters(!showFilters)}
              style={{ whiteSpace: "nowrap" }}
            >
              <i className="fa-solid fa-filter me-2"></i>
              {showFilters ? "Ocultar filtros" : "Filtrar"}
            </button>

            {/* Selector de items por página */}
            <select
              className="form-select form-select-sm"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Filtros</h5>
              <div className="row">
                {/* Obra */}
                <div className="col-md-4 mb-3">
                  <label>Obra</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.obra}
                    onChange={(e) =>
                      setFilters({ ...filters, obra: e.target.value })
                    }
                  />
                </div>

                {/* Caja */}
                <div className="col-md-4 mb-3">
                  <label>Caja</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.caja}
                    onChange={(e) =>
                      setFilters({ ...filters, caja: e.target.value })
                    }
                  />
                </div>

                {/* Entregado por */}
                <div className="col-md-4 mb-3">
                  <label>Entregado por</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.entrego}
                    onChange={(e) =>
                      setFilters({ ...filters, entrego: e.target.value })
                    }
                  />
                </div>

                {/* Recibido por */}
                <div className="col-md-4 mb-3">
                  <label>Recibido por</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.recibio}
                    onChange={(e) =>
                      setFilters({ ...filters, recibio: e.target.value })
                    }
                  />
                </div>

                {/* Ubicación actual */}
                <div className="col-md-4 mb-3">
                  <label>Ubicación actual</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.actual}
                    onChange={(e) =>
                      setFilters({ ...filters, actual: e.target.value })
                    }
                  />
                </div>

                {/* Estado */}
                <div className="col-md-4 mb-3">
                  <label>Estado</label>
                  <select
                    className="form-control"
                    value={filters.estado}
                    onChange={(e) =>
                      setFilters({ ...filters, estado: e.target.value })
                    }
                  >
                    <option value="">Todos</option>
                    <option value="activo">Prestado</option>
                    <option value="devuelto">Devuelto</option>
                  </select>
                </div>

                {/* Botón para limpiar filtros */}
                <div className="mt-3">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={clearFilters}
                  >
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de préstamos */}
        <div className="card shadow-sm">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando préstamos...</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle">
                    <thead>
                      <tr>
                        <th className="text-center">Obra</th>
                        <th className="text-center">Caja</th>
                        <th className="text-center">Quien lo Entregó</th>
                        <th className="text-center">Quien lo Recibió</th>
                        <th className="text-center">Día</th>
                        <th className="text-center">Hora</th>
                        <th className="text-center">Ubicación Anterior</th>
                        <th className="text-center">Ubicación Actual</th>
                        <th className="text-center">Estado</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((prestamo) => (
                          <tr key={prestamo.id}>
                            <td className="text-center">{prestamo.obra}</td>
                            <td className="text-center">{prestamo.caja}</td>
                            <td className="text-center">{prestamo.entrego}</td>
                            <td className="text-center">{prestamo.recibio}</td>
                            <td className="text-center">{prestamo.dia}</td>
                            <td className="text-center">{prestamo.hora}</td>
                            <td className="text-center">{prestamo.anterior}</td>
                            <td className="text-center">{prestamo.actual}</td>
                            <td className="text-center">
                              <span className={`badge ${prestamo.estado === 'devuelto' ? 'bg-success' : 'bg-warning'}`}>
                                {prestamo.estado === 'devuelto' ? 'Devuelto' : 'Prestado'}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="d-flex gap-2 justify-content-center">
                                <Link 
                                  className="btn btn-sm btn-outline-primary"
                                  to={`/prestamo/editar_prestamo/${prestamo.id}`}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </Link>
                                {prestamo.estado !== 'devuelto' && (
                                  <button
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => marcarComoDevuelto(prestamo.id)}
                                    title="Marcar como devuelto"
                                  >
                                    <i className="fa-solid fa-check"></i>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center py-4">
                            No hay préstamos registrados
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                {filteredPrestamos.length > itemsPerPage && (
                  <nav className="mt-4">
                    <div className="d-flex justify-content-center align-items-center">
                      <ul className="pagination justify-content-center m-0">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          >
                            Anterior
                          </button>
                        </li>
                        {[...Array(totalPages).keys()].map(number => (
                          <li
                            key={number + 1}
                            className={`page-item ${currentPage === number + 1 ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(number + 1)}
                            >
                              {number + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          >
                            Siguiente
                          </button>
                        </li>
                      </ul>
                    </div>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
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
    entregadoPor: "",
    recibidoPor: "",
    ubicacionActual: ""
  });

  // Datos de prueba (simulando fetch)
  const mockData = [
    {
      id: 1,
      obra: "La Mona Lisa",
      caja: "Caja 001",
      entregadoPor: "Juan Pérez",
      recibidoPor: "María García",
      dia: "2023-05-15",
      hora: "10:30",
      ubicacionAnterior: "Almacén A",
      ubicacionActual: "Sala de Exposición 1"
    },
    {
      id: 2,
      obra: "La Noche Estrellada",
      caja: "Caja 002",
      entregadoPor: "Carlos López",
      recibidoPor: "Ana Martínez",
      dia: "2023-05-16",
      hora: "11:45",
      ubicacionAnterior: "Almacén B",
      ubicacionActual: "Sala de Restauración"
    },
    {
      id: 3,
      obra: "El Grito",
      caja: "Caja 003",
      entregadoPor: "Luisa Fernández",
      recibidoPor: "Pedro Sánchez",
      dia: "2023-05-17",
      hora: "09:15",
      ubicacionAnterior: "Almacén C",
      ubicacionActual: "Sala de Exposición 2"
    },
    {
      id: 4,
      obra: "Guernica",
      caja: "Caja 004",
      entregadoPor: "Marta Rodríguez",
      recibidoPor: "David González",
      dia: "2023-05-18",
      hora: "14:20",
      ubicacionAnterior: "Almacén A",
      ubicacionActual: "Sala de Exposición 3"
    },
    {
      id: 5,
      obra: "Las Meninas",
      caja: "Caja 005",
      entregadoPor: "Sofía Hernández",
      recibidoPor: "Jorge Díaz",
      dia: "2023-05-19",
      hora: "16:00",
      ubicacionAnterior: "Almacén B",
      ubicacionActual: "Sala de Exposición 1"
    },
    {
      id: 6,
      obra: "La Última Cena",
      caja: "Caja 006",
      entregadoPor: "Elena Moreno",
      recibidoPor: "Raúl Castro",
      dia: "2023-05-20",
      hora: "13:10",
      ubicacionAnterior: "Almacén C",
      ubicacionActual: "Sala de Restauración"
    }
  ];

  // Simulamos un fetch a una API
  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        setLoading(true);
        // Simulamos un retraso de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPrestamos(mockData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, []);

  // Filtrar préstamos
  const filteredPrestamos = prestamos.filter(prestamo => {
    return (
      prestamo.obra.toLowerCase().includes(filters.obra.toLowerCase()) &&
      prestamo.caja.toLowerCase().includes(filters.caja.toLowerCase()) &&
      prestamo.entregadoPor.toLowerCase().includes(filters.entregadoPor.toLowerCase()) &&
      prestamo.recibidoPor.toLowerCase().includes(filters.recibidoPor.toLowerCase()) &&
      prestamo.ubicacionActual.toLowerCase().includes(filters.ubicacionActual.toLowerCase())
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
      entregadoPor: "",
      recibidoPor: "",
      ubicacionActual: ""
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
                    value={filters.entregadoPor}
                    onChange={(e) =>
                      setFilters({ ...filters, entregadoPor: e.target.value })
                    }
                  />
                </div>

                {/* Recibido por */}
                <div className="col-md-4 mb-3">
                  <label>Recibido por</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.recibidoPor}
                    onChange={(e) =>
                      setFilters({ ...filters, recibidoPor: e.target.value })
                    }
                  />
                </div>

                {/* Ubicación actual */}
                <div className="col-md-4 mb-3">
                  <label>Ubicación actual</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.ubicacionActual}
                    onChange={(e) =>
                      setFilters({ ...filters, ubicacionActual: e.target.value })
                    }
                  />
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
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((prestamo) => (
                          <tr key={prestamo.id}>
                            <td className="text-center">{prestamo.obra}</td>
                            <td className="text-center">{prestamo.caja}</td>
                            <td className="text-center">{prestamo.entregadoPor}</td>
                            <td className="text-center">{prestamo.recibidoPor}</td>
                            <td className="text-center">{prestamo.dia}</td>
                            <td className="text-center">{prestamo.hora}</td>
                            <td className="text-center">{prestamo.ubicacionAnterior}</td>
                            <td className="text-center">{prestamo.ubicacionActual}</td>
                            <td className="text-center">
                              <Link 
                                className="btn btn-sm btn-outline-primary"
                                to={`/prestamo/editar_prestamo/${prestamo.id}`}
                              >
                                <i className="fa-solid fa-pen-to-square"></i> Editar
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center py-4">
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
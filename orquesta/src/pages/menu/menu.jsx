import React, { useState, useEffect } from "react";
import Layout from "../../layout/layout";
import { Link } from "react-router-dom";
import "./styles/menu.css";
import Imprimir from "../../components/ui/imprimir";
import InstrumentosModal from "../../components/ui/InstrumentsModal";
import PartituraModal from "../../components/ui/PartituraModal";

export default function Menu() {
  const [partituras, setPartituras] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPartitura, setSelectedPartitura] = useState(null);
  const [, setShowDetailsModal] = useState(false);
  const [selectedPartituraDetails, setSelectedPartituraDetails] =
    useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    obra: "",
    archivista: "",
    caja: "",
    compositores: [""],
    arreglistas: [""],
    orquestaciones: [""],
    categoria: "",
    score: "",
    observaciones: "",
  });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construir los parámetros de la consulta a partir del estado 'filters'
        const queryParams = new URLSearchParams({
          page: currentPage,
          pageSize: itemsPerPage,
          obra: filters.obra,
          archivista: filters.archivista,
          categoria: filters.categoria,
          score: filters.score,
          observaciones: filters.observaciones,
          caja: filters.caja,
          // Para campos que son arrays, se separan por ';'
          compositores: filters.compositores.join(";"),
          arreglistas: filters.arreglistas.join(";"),
          orquestaciones: filters.orquestaciones.join(";"),
        });

        const response = await fetch(
          `http://localhost:3000/api/partituras?${queryParams.toString()}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();

        setPartituras(data.partituras);
        setTotalPages(data.paginas);
      } catch (error) {
        console.error("Error fetching partituras:", error);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, filters]);

  const handleMultiFilterChange = (type, index, value) => {
    const newValues = [...filters[type]];
    newValues[index] = value;
    setFilters((prev) => ({ ...prev, [type]: newValues }));
  };

  const addFilterField = (type) => {
    setFilters((prev) => ({ ...prev, [type]: [...prev[type], ""] }));
  };

  const removeFilterField = (type, index) => {
    if (filters[type].length > 1) {
      const newValues = filters[type].filter((_, i) => i !== index);
      setFilters((prev) => ({ ...prev, [type]: newValues }));
    }
  };

  const clearFilters = () => {
    setFilters({
      obra: "",
      archivista: "",
      caja: "",
      compositores: [""],
      arreglistas: [""],
      orquestaciones: [""],
      categoria: "",
      score: "",
      observaciones: "",
    });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      {/* Contenido principal - 80% del ancho */}
      <div className="main-content p-4 ms-2">
        {/* Header con título y botones */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Partituras</h1>
          <div className="d-flex gap-2">
            <Imprimir />
            <button className="btn btn-blue">
              <Link
                to="/new_partitura"
                className="text-white text-decoration-none"
              >
                + Crear Partitura
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

            {/* Mantener el selector de items por página siempre visible */}
            <select
              className="form-select form-select-sm"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
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
                      setFilters((prev) => ({ ...prev, obra: e.target.value }))
                    }
                  />
                </div>

                {/* Compositores */}
                <div className="col-md-4 mb-3">
                  <label>Compositores</label>
                  {filters.compositores.map((comp, index) => (
                    <div key={index} className="d-flex gap-2 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={comp}
                        onChange={(e) =>
                          handleMultiFilterChange(
                            "compositores",
                            index,
                            e.target.value
                          )
                        }
                      />
                      {index > 0 && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            removeFilterField("compositores", index)
                          }
                        >
                          -
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className="btn btn-primary btn-sm mt-1"
                    onClick={() => addFilterField("compositores")}
                  >
                    + Añadir compositor
                  </button>
                </div>

                {/* Arreglistas */}
                <div className="col-md-4 mb-3">
                  <label>Arreglistas</label>
                  {filters.arreglistas.map((arr, index) => (
                    <div key={index} className="d-flex gap-2 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={arr}
                        onChange={(e) =>
                          handleMultiFilterChange(
                            "arreglistas",
                            index,
                            e.target.value
                          )
                        }
                      />
                      {index > 0 && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            removeFilterField("arreglistas", index)
                          }
                        >
                          -
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className="btn btn-primary btn-sm mt-1"
                    onClick={() => addFilterField("arreglistas")}
                  >
                    + Añadir arreglista
                  </button>
                </div>

                {/* Orquestaciones */}
                <div className="col-md-4 mb-3">
                  <label>Orquestaciones</label>
                  {filters.orquestaciones.map((orq, index) => (
                    <div key={index} className="d-flex gap-2 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={orq}
                        onChange={(e) =>
                          handleMultiFilterChange(
                            "orquestaciones",
                            index,
                            e.target.value
                          )
                        }
                      />
                      {index > 0 && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            removeFilterField("orquestaciones", index)
                          }
                        >
                          -
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className="btn btn-primary btn-sm mt-1"
                    onClick={() => addFilterField("orquestaciones")}
                  >
                    + Añadir orquestación
                  </button>
                </div>

                {/* Score */}
                <div className="col-md-4 mb-3">
                  <label>Score</label>
                  <select
                    className="form-control"
                    value={filters.score}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, score: e.target.value }))
                    }
                  >
                    <option value="">Todos</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Caja */}
                <div className="col-md-4 mb-3">
                  <label>Caja</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Caja"
                    value={filters.caja}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        caja: e.target.value,
                      }));
                    }}
                  />
                </div>

                {/* Observaciones */}
                <div className="col-md-4 mb-3">
                  <label>Observaciones</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.observaciones}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        observaciones: e.target.value,
                      }))
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

        {/* Modal Detalles de Partitura */}
        {selectedPartituraDetails && (
          <PartituraModal
            partitura={selectedPartituraDetails}
            onClose={() => {
              setSelectedPartituraDetails(null);
              setShowDetailsModal(false);
            }}
          />
        )}

        {/* Modal de Instrumentos */}
        {selectedPartitura && (
          <InstrumentosModal
            partitura={selectedPartitura}
            onClose={() => setSelectedPartitura(null)}
          />
        )}

        {/* Tabla de partituras */}
        <div className="table-responsive" style={{ overflowY: "auto" }}>
          <table className="table table-striped table-hover align-middle">
            <thead className="sticky-top bg-white">
              <tr>
                <th style={{ minWidth: "180px" }}>Obra</th>
                <th style={{ minWidth: "120px" }}>Archivista</th>
                <th style={{ minWidth: "80px" }}>Caja</th>
                <th style={{ minWidth: "150px" }}>Compositor</th>
                <th style={{ minWidth: "150px" }}>Arreglista</th>
                <th style={{ minWidth: "140px" }}>Orquestación</th>
                <th className="text-center" style={{ width: "50px" }}>
                  Instrumentos
                </th>
                <th style={{ minWidth: "120px" }}>Categoría</th>
                <th style={{ minWidth: "90px" }}>Formato</th>
                <th style={{ width: "80px" }}>Score</th>
                <th style={{ minWidth: "120px" }}>Sede</th>
                <th style={{ minWidth: "200px" }}>Observaciones</th>
                <th style={{ width: "100px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {partituras.map((partitura, index) => (
                <tr key={index}>
                  <td
                    className="text-truncate"
                    style={{ maxWidth: "180px" }}
                    title={partitura.obra}
                  >
                    {partitura.obra}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "120px" }}>
                    {partitura.archivista}
                  </td>
                  <td>{partitura.caja}</td>
                  <td
                    className="text-truncate"
                    style={{ maxWidth: "150px" }}
                    title={partitura.compositor}
                  >
                    {partitura.compositor}
                  </td>
                  <td
                    className="text-truncate"
                    style={{ maxWidth: "150px" }}
                    title={partitura.arreglista}
                  >
                    {partitura.arreglista}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "140px" }}>
                    {partitura.orquestacion}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setSelectedPartitura(partitura)}
                      title="Ver instrumentos"
                    >
                      <i className="fa-solid fa-ellipsis"></i>
                    </button>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "120px" }}>
                    {partitura.categoria}
                  </td>
                  <td>{partitura.formato}</td>
                  <td>{partitura.score ? "Sí" : "No"}</td>
                  <td className="text-truncate" style={{ maxWidth: "120px" }}>
                    {partitura.sede}
                  </td>
                  <td
                    className="text-truncate"
                    style={{ maxWidth: "200px" }}
                    title={partitura.observaciones}
                  >
                    {partitura.observaciones}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setSelectedPartituraDetails(partitura);
                          setShowDetailsModal(true);
                        }}
                        title="Ver detalles completos"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <Link
                        to={`/editar_partitura/${partitura.id}`}
                        className="btn btn-sm btn-primary"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Controles de paginación */}
        <nav className="mt-4">
          <div className="d-flex justify-content-center align-items-center">
            <ul className="pagination justify-content-center m-0">
              {/* Botones de paginación existentes */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
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
                  className={`page-item ${
                    currentPage === number + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(number + 1)}
                  >
                    {number + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </Layout>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/layout";

export default function Usuarios() {
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

          {/* Tabla de partituras */}
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
              <tbody>{/* Aquí irían las filas de datos */}</tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/layout";

export default function Usuarios() {
  return (
    <Layout>
      <div className="d-flex vh-100">
        {/* Sidebar - 20% del ancho */}
        <div
          className="sidebar bg-light d-flex flex-column"
          style={{ width: "20%" }}
        >
          {/* Logo */}
          <div className="sidebar-header p-4 text-center">
            <img
              src="/brand/logo.webp"
              alt="Logo"
              className="img-fluid"
              style={{ maxWidth: "220px", width: "100%" }}
            />
          </div>

          {/* Opciones del menú */}
          <nav className="flex-grow-1 p-3">
            <div className="d-flex flex-column gap-2">
              <Link
                to="/partituras"
                className="btn btn-outline-secondary text-start rounded-pill d-flex justify-content-between align-items-center"
              >
                Partituras
                <i className="fa-solid fa-music ms-2"></i>
              </Link>
              <Link
                to="/reportes"
                className="btn btn-outline-secondary text-start rounded-pill d-flex justify-content-between align-items-center"
              >
                Reportes
                <i className="fa-solid fa-chart-column ms-2"></i>
              </Link>
              <Link
                to="/usuarios"
                className="btn btn-outline-secondary text-start rounded-pill d-flex justify-content-between align-items-center"
              >
                Usuarios
                <i className="fa-solid fa-users ms-2"></i>
              </Link>
            </div>
          </nav>

          {/* Botón de regreso */}
          <div className="p-3 mt-auto">
            <Link
              to="/"
              className="btn btn-link text-muted w-100 d-flex align-items-center justify-content-center"
            >
              <i className="fa-solid fa-arrow-left me-2"></i>
              Volver al Login
            </Link>
          </div>
        </div>

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

import React from 'react'
import Layout from '../../layout/layout'
import { Link } from 'react-router-dom'
import './styles/menu.css'

export default function Menu() {
    return (
        <Layout>
            {/* <div className="d-flex vh-100"> */}

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

                {/* Tabla de partituras */}
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Archivero</th>
                                <th>Caja</th>
                                <th>Compositor</th>
                                <th>Arreglista</th>
                                <th>Orquestación</th>
                                <th>Obra</th>
                                <th>Originales</th>
                                <th>#</th>
                                <th>Copias</th>
                                <th>#</th>
                                <th>Categoría</th>
                                <th>Score</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>{/* Aquí irían las filas de datos */}</tbody>
                    </table>
                </div>
            </div>
            {/* </div> */}
        </Layout>
    )
}

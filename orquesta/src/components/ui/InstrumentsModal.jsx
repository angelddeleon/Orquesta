import React from "react";

const InstrumentosModal = ({ partitura, onClose }) => {
  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Instrumentos - {partitura.obra}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => onClose()}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h5>Originales</h5>

                {partitura.instrumentos_originales?.length > 0 ? (
                  <ul className="list-group">
                    {partitura.instrumentos_originales.map((inst, i) => (
                      <li
                        key={`orig-${i}`}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {inst.nombre}
                        <span className="badge bg-primary rounded-pill">
                          {inst.cantidad}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="alert alert-info">
                    No hay instrumentos originales registrados
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <h5>Copias</h5>
                {partitura.instrumentos_copias?.length > 0 ? (
                  <ul className="list-group">
                    {partitura.instrumentos_copias.map((inst, i) => (
                      <li
                        key={`copy-${i}`}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {inst.nombre}
                        <span className="badge bg-success rounded-pill">
                          {inst.cantidad}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="alert alert-info">
                    No hay instrumentos copia registrados
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onClose()}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentosModal;

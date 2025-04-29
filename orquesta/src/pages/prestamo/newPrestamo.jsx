import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../../layout/layout";
import { useNavigate } from "react-router-dom";

export default function NewPrestamo() {
  const navigate = useNavigate();
  
  // Estado inicial del formulario
  const [prestamo, setPrestamo] = useState({
    obra: "",
    caja: "",
    entrego: "",
    recibio: "",
    dia: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    hora: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    anterior: "",
    actual: "",
    estado: "prestado"
  });

  const [loading, setLoading] = useState(false);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrestamo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador de envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await fetch('https://backend.sinfocarabobo.com/api/prestamos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(prestamo)
      });
      
      if (!response.ok) {
        throw new Error('Error al crear el préstamo');
      }

      toast.success("Préstamo creado con éxito", {
        onClose: () => navigate("/prestamo"),
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(`Error al crear préstamo: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="wrapper overflow-hidden px-4 py-2">
        <div className="d-flex align-items-center justify-content-center my-5 my-lg-0">
          <div className="container-fluid">
            <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
              <div className="col mx-auto">
                <div className="my-4 text-center">
                  <p className="fw-bold text-nowrap text-primary">
                    ORQUESTA SINFÓNICA DE CARABOBO
                  </p>
                  <h1>Nuevo Préstamo</h1>
                  <small className="text-secondary">
                    Complete todos los campos para registrar un nuevo préstamo
                  </small>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="p-4">
                      <div className="form-body">
                        <form className="row g-3" onSubmit={handleSubmit}>
                          {/* Obra */}
                          <div className="col-12">
                            <label htmlFor="obra" className="form-label">
                              <i className="fa-solid fa-book me-2"></i>
                              Obra/Material
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="obra"
                              name="obra"
                              required
                              value={prestamo.obra}
                              onChange={handleChange}
                              placeholder="Ej: Sinfonía No. 5"
                            />
                          </div>

                          {/* Caja/Número */}
                          <div className="col-12">
                            <label htmlFor="caja" className="form-label">
                              <i className="fa-solid fa-box me-2"></i>
                              Caja/Número/Identificador
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="caja"
                              name="caja"
                              required
                              value={prestamo.caja}
                              onChange={handleChange}
                              placeholder="Ej: Caja 001, Partitura A25"
                            />
                          </div>

                          {/* Entregado por */}
                          <div className="col-12">
                            <label htmlFor="entrego" className="form-label">
                              <i className="fa-solid fa-user-tie me-2"></i>
                              Quién lo entrega
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="entrego"
                              name="entrego"
                              required
                              value={prestamo.entrego}
                              onChange={handleChange}
                              placeholder="Nombre de quien entrega el material"
                            />
                          </div>

                          {/* Recibido por */}
                          <div className="col-12">
                            <label htmlFor="recibio" className="form-label">
                              <i className="fa-solid fa-user-check me-2"></i>
                              Quién lo recibe
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="recibio"
                              name="recibio"
                              required
                              value={prestamo.recibio}
                              onChange={handleChange}
                              placeholder="Nombre de quien recibe el material"
                            />
                          </div>

                          {/* Fecha */}
                          <div className="col-sm-6">
                            <label htmlFor="dia" className="form-label">
                              <i className="fa-solid fa-calendar-day me-2"></i>
                              Fecha del préstamo
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              id="dia"
                              name="dia"
                              required
                              value={prestamo.dia}
                              onChange={handleChange}
                            />
                          </div>

                          {/* Hora */}
                          <div className="col-sm-6">
                            <label htmlFor="hora" className="form-label">
                              <i className="fa-solid fa-clock me-2"></i>
                              Hora del préstamo
                            </label>
                            <input
                              type="time"
                              className="form-control"
                              id="hora"
                              name="hora"
                              required
                              value={prestamo.hora}
                              onChange={handleChange}
                            />
                          </div>

                          {/* Ubicación anterior */}
                          <div className="col-12">
                            <label htmlFor="anterior" className="form-label">
                              <i className="fa-solid fa-map-marker-alt me-2"></i>
                              Ubicación anterior
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="anterior"
                              name="anterior"
                              required
                              value={prestamo.anterior}
                              onChange={handleChange}
                              placeholder="Ej: UJAP, Av. Bolívar, Hesperia, etc."
                            />
                          </div>

                          {/* Ubicación actual */}
                          <div className="col-12">
                            <label htmlFor="actual" className="form-label">
                              <i className="fa-solid fa-exchange-alt me-2"></i>
                              Ubicación actual (destino)
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="actual"
                              name="actual"
                              required
                              value={prestamo.actual}
                              onChange={handleChange}
                              placeholder="Ej: UJAP, Av. Bolívar, Hesperia, etc."
                            />
                          </div>

                          {/* Estado (oculto ya que siempre será "prestado" al crear) */}
                          <input type="hidden" name="estado" value="prestado" />

                          {/* Botones */}
                          <div className="col-12">
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                              <button 
                                type="button" 
                                className="btn btn-secondary me-md-2"
                                onClick={() => navigate("/prestamo")}
                                disabled={loading}
                              >
                                <i className="fa-solid fa-times me-2"></i>
                                Cancelar
                              </button>
                              <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Registrando...
                                  </>
                                ) : (
                                  <>
                                    <i className="fa-solid fa-save me-2"></i>
                                    Registrar Préstamo
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}
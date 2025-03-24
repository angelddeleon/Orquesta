import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../../layout/layout";
import ExpansiveToast from "../../components/ui/expansiveToast";
import { useNavigate } from "react-router-dom";

export default function NewPrestamo() {
  const navigate = useNavigate();
  
  // Estados para el formulario
  const [obra, setObra] = useState("");
  const [caja, setCaja] = useState("");
  const [entregadoPor, setEntregadoPor] = useState("");
  const [recibidoPor, setRecibidoPor] = useState("");
  const [ubicacionAnterior, setUbicacionAnterior] = useState("");
  const [ubicacionActual, setUbicacionActual] = useState("");
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");

  // Manejador de envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const data = {
      obra,
      caja,
      entregadoPor,
      recibidoPor,
      ubicacionAnterior,
      ubicacionActual,
      dia,
      hora
    };
    
    console.log(data);
    sendForm(data);
  };

  // Función para enviar el formulario
  const sendForm = async (data) => {
    try {
      // Aquí iría la llamada real a tu API
      // Simulamos un retraso de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulación de éxito
      toast.success("Préstamo creado con éxito", {
        onClose: () => navigate("/prestamo"),
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(
        <ExpansiveToast
          title="Error al crear el préstamo"
          content={
            <>
              <p className="mb-2 fs-6">{error.message}</p>
            </>
          }
        />,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
        }
      );
      console.error("Error:", error);
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
                    Rellene todo el siguiente formulario y una vez finalizado
                    presione el botón
                  </small>
                </div>
                <div className="">
                  <div className="card-body">
                    <div className="p-4">
                      <div className="form-body">
                        <form className="row g-3" onSubmit={handleSubmit}>
                          {/* Obra */}
                          <div className="col-12">
                            <label htmlFor="obra" className="form-label">
                              Obra
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="obra"
                              required
                              value={obra}
                              onChange={(e) => setObra(e.target.value)}
                            />
                          </div>

                          {/* Caja */}
                          <div className="col-12">
                            <label htmlFor="caja" className="form-label">
                              Caja
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="caja"
                              required
                              value={caja}
                              onChange={(e) => setCaja(e.target.value)}
                            />
                          </div>

                          {/* Entregado por */}
                          <div className="col-12">
                            <label htmlFor="entregadoPor" className="form-label">
                              Quién lo entregó
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="entregadoPor"
                              required
                              value={entregadoPor}
                              onChange={(e) => setEntregadoPor(e.target.value)}
                            />
                          </div>

                          {/* Recibido por */}
                          <div className="col-12">
                            <label htmlFor="recibidoPor" className="form-label">
                              Quién lo recibió
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="recibidoPor"
                              required
                              value={recibidoPor}
                              onChange={(e) => setRecibidoPor(e.target.value)}
                            />
                          </div>

                          {/* Día */}
                          <div className="col-sm-6">
                            <label htmlFor="dia" className="form-label">
                              Día
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              id="dia"
                              required
                              value={dia}
                              onChange={(e) => setDia(e.target.value)}
                            />
                          </div>

                          {/* Hora */}
                          <div className="col-sm-6">
                            <label htmlFor="hora" className="form-label">
                              Hora
                            </label>
                            <input
                              type="time"
                              className="form-control"
                              id="hora"
                              required
                              value={hora}
                              onChange={(e) => setHora(e.target.value)}
                            />
                          </div>

                          {/* Ubicación anterior */}
                          <div className="col-12">
                            <label htmlFor="ubicacionAnterior" className="form-label">
                              Ubicación anterior
                            </label>
                            <select
                              className="form-select"
                              id="ubicacionAnterior"
                              required
                              value={ubicacionAnterior}
                              onChange={(e) => setUbicacionAnterior(e.target.value)}
                            >
                              <option value="">Seleccionar ubicación</option>
                              <option value="UJAP">UJAP</option>
                              <option value="Bolivar">Avenida Bolivar</option>
                              <option value="Hesperia">Hesperia</option>
                            </select>
                          </div>

                          {/* Ubicación actual */}
                          <div className="col-12">
                            <label htmlFor="ubicacionActual" className="form-label">
                              Ubicación actual
                            </label>
                            <select
                              className="form-select"
                              id="ubicacionActual"
                              required
                              value={ubicacionActual}
                              onChange={(e) => setUbicacionActual(e.target.value)}
                            >
                              <option value="">Seleccionar ubicación</option>
                              <option value="UJAP">UJAP</option>
                              <option value="Bolivar">Avenida Bolivar</option>
                              <option value="Hesperia">Hesperia</option>
                            </select>
                          </div>

                          {/* Botón de envío */}
                          <div className="col-12">
                            <div className="d-grid">
                              <button className="btn btn-primary">
                                <i className="bx bx-save"></i>
                                Crear Préstamo
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
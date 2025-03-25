import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../../layout/layout";
import ExpansiveToast from "../../components/ui/expansiveToast";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarPrestamo() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados para el formulario
  const [prestamo, setPrestamo] = useState({
    obra: "",
    caja: "",
    entregadoPor: "",
    recibidoPor: "",
    ubicacionAnterior: "",
    ubicacionActual: "",
    dia: "",
    hora: ""
  });
  const [loading, setLoading] = useState(true);

  // Simulación de fetch para obtener los datos del préstamo
  useEffect(() => {
    const fetchPrestamo = async () => {
      try {
        setLoading(true);
        // Simulamos un retraso de red
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Datos mock para demostración - en una app real esto vendría de tu API
        const mockData = {
          id: id,
          obra: "La Mona Lisa",
          caja: "Caja 001",
          entregadoPor: "Juan Pérez",
          recibidoPor: "María García",
          dia: "2023-05-15",
          hora: "10:30",
          ubicacionAnterior: "Almacén A",
          ubicacionActual: "Sala de Exposición 1"
        };
        
        setPrestamo(mockData);
      } catch (error) {
        toast.error(
          <ExpansiveToast
            title="Error al cargar el préstamo"
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
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamo();
  }, [id]);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrestamo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador de envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Datos a actualizar:", prestamo);
    updatePrestamo(prestamo);
  };

  // Función para actualizar el préstamo
  const updatePrestamo = async (data) => {
    try {
      setLoading(true);
      // Aquí iría la llamada real a tu API
      // Simulamos un retraso de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulación de éxito
      toast.success("Préstamo actualizado con éxito", {
        onClose: () => navigate("/prestamo"),
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(
        <ExpansiveToast
          title="Error al actualizar el préstamo"
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Layout>
    );
  }

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
                  <h1>Editar Préstamo</h1>
                  <small className="text-secondary">
                    Modifique los campos necesarios y guarde los cambios
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
                              name="obra"
                              required
                              value={prestamo.obra}
                              onChange={handleChange}
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
                              name="caja"
                              required
                              value={prestamo.caja}
                              onChange={handleChange}
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
                              name="entregadoPor"
                              required
                              value={prestamo.entregadoPor}
                              onChange={handleChange}
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
                              name="recibidoPor"
                              required
                              value={prestamo.recibidoPor}
                              onChange={handleChange}
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
                              name="dia"
                              required
                              value={prestamo.dia}
                              onChange={handleChange}
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
                              name="hora"
                              required
                              value={prestamo.hora}
                              onChange={handleChange}
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
                              name="ubicacionAnterior"
                              required
                              value={prestamo.ubicacionAnterior}
                              onChange={handleChange}
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
                              name="ubicacionActual"
                              required
                              value={prestamo.ubicacionActual}
                              onChange={handleChange}
                            >
                              <option value="">Seleccionar ubicación</option>
                              <option value="UJAP">UJAP</option>
                              <option value="Bolivar">Avenida Bolivar</option>
                              <option value="Hesperia">Hesperia</option>
                            </select>
                          </div>

                          {/* Botones */}
                          <div className="col-12">
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                              <button 
                                type="button" 
                                className="btn btn-secondary me-md-2"
                                onClick={() => navigate("/prestamo")}
                              >
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
                                    Guardando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save me-2"></i>
                                    Guardar Cambios
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
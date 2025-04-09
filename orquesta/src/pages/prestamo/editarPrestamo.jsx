import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../../layout/layout";
import ExpansiveToast from "../../components/ui/expansiveToast";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarPrestamo() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados para el formulario con todos los campos necesarios
  const [prestamo, setPrestamo] = useState({
    obra: "",
    caja: "",
    entrego: "", // Cambiado a entrego para coincidir con el listado
    recibio: "", // Cambiado a recibio para coincidir con el listado
    dia: "",
    hora: "",
    anterior: "", // Cambiado a anterior para coincidir con el listado
    actual: "", // Cambiado a actual para coincidir con el listado
    estado: "prestado"
  });
  const [loading, setLoading] = useState(true);

  // Obtener todos los datos del préstamo al cargar el componente
  useEffect(() => {
    const fetchPrestamo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/prestamos/${id}`,{
          credentials: "include"
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar los datos del préstamo');
        }
        
        const data = await response.json();
        
        // Mapeamos los nombres de campos si es necesario
        setPrestamo({
          obra: data.obra || "",
          caja: data.caja || "",
          entrego: data.entrego || "",
          recibio: data.recibio || "",
          dia: data.dia || "",
          hora: data.hora || "",
          anterior: data.anterior || "",
          actual: data.actual || "",
          estado: data.estado || "prestado"
        });
        
      } catch (error) {
        toast.error(
          <ExpansiveToast
            title="Error al cargar datos"
            content={
              <>
                <p className="mb-2 fs-6">{error.message}</p>
                <p>Por favor, intente nuevamente más tarde.</p>
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
        console.error("Error fetching prestamo:", error);
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch(`/api/prestamos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(prestamo)
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el préstamo');
      }

      console.log("Prestamo actualizado:", prestamo);

      navigate("/prestamo");
      
    } catch (error) {
      toast.error(
        <ExpansiveToast
          title="Error al guardar cambios"
          content={
            <>
              <p className="mb-2 fs-6">{error.message}</p>
              <p>Verifique los datos e intente nuevamente.</p>
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

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="ms-3 mb-0">Cargando datos del préstamo...</p>
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
                <div className="card">
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
                              Caja/Número
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
                            <label htmlFor="entrego" className="form-label">
                              Quién lo entregó
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="entrego"
                              name="entrego"
                              required
                              value={prestamo.entrego}
                              onChange={handleChange}
                            />
                          </div>

                          {/* Recibido por */}
                          <div className="col-12">
                            <label htmlFor="recibio" className="form-label">
                              Quién lo recibió
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="recibio"
                              name="recibio"
                              required
                              value={prestamo.recibio}
                              onChange={handleChange}
                            />
                          </div>

                          {/* Día */}
                          <div className="col-sm-6">
                            <label htmlFor="dia" className="form-label">
                              Fecha
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
                            <label htmlFor="anterior" className="form-label">
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
                            />
                          </div>

                          {/* Ubicación actual */}
                          <div className="col-12">
                            <label htmlFor="actual" className="form-label">
                              Ubicación actual
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="actual"
                              name="actual"
                              required
                              value={prestamo.actual}
                              onChange={handleChange}
                            />
                          </div>

                          {/* Estado */}
                          <div className="col-12">
                            <label htmlFor="estado" className="form-label">
                              Estado del préstamo
                            </label>
                            <select
                              className="form-select"
                              id="estado"
                              name="estado"
                              required
                              value={prestamo.estado}
                              onChange={handleChange}
                            >
                              <option value="prestado">Prestado</option>
                              <option value="devuelto">Devuelto</option>
                            </select>
                            <div className="form-text">
                              Marque como "Devuelto" cuando el ítem haya sido retornado
                            </div>
                          </div>

                          {/* Botones */}
                          <div className="col-12">
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                              <button 
                                type="button" 
                                className="btn btn-secondary me-md-2"
                                onClick={() => navigate("/prestamo")}
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
                                    Guardando...
                                  </>
                                ) : (
                                  <>
                                    <i className="fa-solid fa-save me-2"></i>
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
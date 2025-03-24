import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../../layout/layout";
import ExpansiveToast from "../../components/ui/expansiveToast";
import { useNavigate } from "react-router-dom";

export default function NewPartitura() {
  const navigate = useNavigate(); // Hook de react-router-dom para navegar entre rutas
  // Opciones para instrumentos.PLACEHOLDER, debe venir del backend?
  const instrumentOptions = [
    "Violín",
    "Viola",
    "Violonchelo",
    "Contrabajo",
    "Flauta",
    "Oboe",
    "Clarinete",
    "Fagot",
    "Trompeta",
    "Trombón",
    "Tuba",
    "Percusión",
    "Arpa",
    "Piano",
    "Nuevo...",
  ];

  // Agregar estado para sede y obra
  const [obra, setObra] = useState("");
  const [sede, setSede] = useState("");
  const [formato, setFormato] = useState("");

  // estado de Compositores
  const [compositor, setCompositor] = useState([""]);

  //Spread Operator para agregar compositores
  const addCompositor = () => setCompositor([...compositor, ""]);

  //Remueve en base al index
  const removeCompositor = (indexToRemove) => {
    setCompositor(compositor.filter((_, index) => index !== indexToRemove));
  };
  //Handler para agregar compositores
  const handleCompositorChange = (index, value) => {
    const newcompositor = [...compositor];
    newcompositor[index] = value;
    setCompositor(newcompositor);
  };

  // estado Arreglistas
  const [arrangers, setArrangers] = useState([""]);

  //Spread Operator para agregar compositores
  const addArranger = () => setArrangers([...arrangers, ""]);

  //Remueve en base al index
  const removeArranger = (indexToRemove) => {
    setArrangers(arrangers.filter((_, index) => index !== indexToRemove));
  };

  //Handler para agregar arreglistas
  const handleArrangerChange = (index, value) => {
    const newArrangers = [...arrangers];
    newArrangers[index] = value;
    setArrangers(newArrangers);
  };

  // Estados para instrumentos
  const [originales, setOriginales] = useState([]);
  const [copias, setCopias] = useState([]);

  // Handlers para Originales
  const addOriginal = () =>
    setOriginales([
      ...originales,
      { instrument: "", quantity: "", isNew: false },
    ]);
  const removeOriginal = (index) =>
    setOriginales(originales.filter((_, i) => i !== index));
  const handleOriginalChange = (index, field, value) => {
    const newOriginales = [...originales];

    if (field === "instrument") {
      if (value === "Nuevo...") {
        // Modo nuevo instrumento
        newOriginales[index] = {
          instrument: "",
          quantity: originales[index].quantity,
          isNew: true,
        };
      } else {
        // Mantener el estado actual de isNew
        newOriginales[index] = {
          instrument: value,
          quantity: originales[index].quantity,
          isNew: originales[index].isNew,
        };
      }
    } else {
      newOriginales[index][field] = value;
    }

    setOriginales(newOriginales);
  };

  // Handlers para Copias
  const addCopia = () =>
    setCopias([...copias, { instrument: "", quantity: "", isNew: false }]);
  const removeCopia = (index) =>
    setCopias(copias.filter((_, i) => i !== index));
  const handleCopiaChange = (index, field, value) => {
    const newCopias = [...copias];

    if (field === "instrument") {
      if (value === "Nuevo...") {
        newCopias[index] = {
          instrument: "",
          quantity: copias[index].quantity,
          isNew: true,
        };
      } else {
        newCopias[index] = {
          instrument: value,
          quantity: copias[index].quantity,
          isNew: copias[index].isNew,
        };
      }
    } else {
      newCopias[index][field] = value;
    }

    setCopias(newCopias);
  };

  // Manejador de envío del formulario
  // Manejador de envío del formulario actualizado
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      Obra: obra,
      Archivero: event.target.archivero.value,
      Caja: event.target.caja.value,
      Sede: sede,
      Compositores: compositor,
      Arreglistas: arrangers,
      Orquestacion: event.target.orquestacion.value
        .split(";")
        .map((item) => item.trim()),
      Formato: formato,
      Instrumentos: {
        Original: originales.map((original) => ({
          Nombre: original.instrument,
          Cantidad: Number(original.quantity),
        })),
        Copia: copias.map((copia) => ({
          Nombre: copia.instrument,
          Cantidad: Number(copia.quantity),
        })),
      },
      Categoria: event.target.categoriaOrquesta.value,
      Score: event.target.score.value === "si",
      Observaciones: event.target.observaciones.value,
    };
    console.log(data);
    sendForm(data);
  };

  // Función sendForm actualizada
  const sendForm = async (data) => {
    try {
      console.log(data);
      const response = await fetch("http://localhost:3000/api/partituras", {
        // Ajusta la URL según tu API
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Error al crear la partitura");
      }

      toast.success("Partitura creada con éxito", {
        onClose: () => navigate("/menu"),
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(
        <ExpansiveToast
          title="Error al crear la partitura"
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
      <>
        <div className="wrapper overflow-hidden px-4 py-2">
          <div className="d-flex align-items-center justify-content-center my-5 my-lg-0">
            <div className="container-fluid">
              <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
                <div className="col mx-auto">
                  <div className="my-4 text-center">
                    <p className="fw-bold text-nowrap text-primary">
                      ORQUESTA SINFÓNICA DE CARABOBO
                    </p>
                    <h1>Nueva Partitura</h1>
                    <small className="text-secondary">
                      Rellene todo el siguiente formulario y una vez finalizado
                      presione el boton
                    </small>
                  </div>
                  <div className="">
                    <div className="card-body">
                      <div className="p-4">
                        <div className="form-body">
                          <form className="row g-3" onSubmit={handleSubmit}>
                            <div className="col-sm-6">
                              <label htmlFor="archivero" className="form-label">
                                Archivero
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="archivero"
                                placeholder="A"
                              />
                            </div>
                            <div className="col-sm-6">
                              <label htmlFor="caja" className="form-label">
                                Caja
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="caja"
                                placeholder="001"
                              />
                            </div>

                            {/* Compositores */}
                            <div className="col-12">
                              <label className="form-label">Compositores</label>
                              {compositor.map((Compositor, index) => (
                                <div
                                  className="input-group mb-2"
                                  key={`Compositor-${index}`}
                                >
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={Compositor}
                                    onChange={(e) =>
                                      handleCompositorChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Compositor ${index + 1}`}
                                  />
                                  {index === compositor.length - 1 && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary"
                                      onClick={addCompositor}
                                    >
                                      +
                                    </button>
                                  )}
                                  {index > 0 && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger"
                                      onClick={() => removeCompositor(index)}
                                      disabled={Compositor.trim() !== ""}
                                    >
                                      -
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
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

                            <div className="col-12">
                              <label htmlFor="sede" className="form-label">
                                Sede
                              </label>
                              <select
                                className="form-select"
                                id="sede"
                                required
                                value={sede}
                                onChange={(e) => setSede(e.target.value)}
                              >
                                <option value="">Seleccionar sede</option>
                                <option value="Hesperia">Hesperia</option>
                                <option value="Av. Bolivar">Av. Bolivar</option>
                                <option value="Univ. José Antonio Páez">
                                  Univ. José Antonio Páez
                                </option>
                              </select>
                            </div>

                            <div className="col-12">
                              <label htmlFor="formato" className="form-label">
                                Formato
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="formato"
                                required
                                value={formato}
                                onChange={(e) => setFormato(e.target.value)}
                              />
                            </div>
                            {/* Arreglistas */}
                            <div className="col-12">
                              <label className="form-label">Arreglistas</label>
                              {arrangers.map((arranger, index) => (
                                <div
                                  className="input-group mb-2"
                                  key={`arranger-${index}`}
                                >
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={arranger}
                                    onChange={(e) =>
                                      handleArrangerChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Arreglista ${index + 1}`}
                                  />
                                  {index === arrangers.length - 1 && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary"
                                      onClick={addArranger}
                                    >
                                      +
                                    </button>
                                  )}
                                  {index > 0 && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger"
                                      onClick={() => removeArranger(index)}
                                      disabled={arranger.trim() !== ""}
                                    >
                                      -
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>

                            <div className="col-12">
                              <label
                                htmlFor="orquestacion"
                                className="form-label"
                              >
                                Orquestación
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="orquestacion"
                                placeholder="Orquestación"
                              />
                            </div>

                            <div className="col-12">
                              <label htmlFor="" className="mb-4">
                                Instrumentos
                              </label>
                              {/* Sección Originales */}
                              <div className="mb-4">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <label className="form-label me-2">
                                    Original
                                  </label>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={addOriginal}
                                  >
                                    +
                                  </button>
                                </div>
                                {originales.map((original, index) => (
                                  <div
                                    className="input-group mb-2"
                                    key={`original-${index}`}
                                  >
                                    {original.isNew ? (
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nuevo instrumento"
                                        value={original.instrument}
                                        onChange={(e) =>
                                          handleOriginalChange(
                                            index,
                                            "instrument",
                                            e.target.value
                                          )
                                        }
                                      />
                                    ) : (
                                      <select
                                        className="form-select"
                                        value={original.instrument}
                                        onChange={(e) =>
                                          handleOriginalChange(
                                            index,
                                            "instrument",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">
                                          Seleccionar instrumento
                                        </option>
                                        {instrumentOptions.map((inst, i) => (
                                          <option key={i} value={inst}>
                                            {inst}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                    <input
                                      type="number"
                                      min="1"
                                      className="form-control"
                                      placeholder="Cantidad"
                                      value={original.quantity}
                                      onChange={(e) =>
                                        handleOriginalChange(
                                          index,
                                          "quantity",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger"
                                      onClick={() => removeOriginal(index)}
                                    >
                                      -
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <hr />
                              {/* Sección Copias */}
                              <div className="mb-4">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <label className="form-label me-2">
                                    Copia
                                  </label>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={addCopia}
                                  >
                                    +
                                  </button>
                                </div>
                                {copias.map((copia, index) => (
                                  <div
                                    className="input-group mb-2"
                                    key={`copia-${index}`}
                                  >
                                    {copia.isNew ? (
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nuevo instrumento"
                                        value={copia.instrument}
                                        onChange={(e) =>
                                          handleCopiaChange(
                                            index,
                                            "instrument",
                                            e.target.value
                                          )
                                        }
                                      />
                                    ) : (
                                      <select
                                        className="form-select"
                                        value={copia.instrument}
                                        onChange={(e) =>
                                          handleCopiaChange(
                                            index,
                                            "instrument",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">
                                          Seleccionar instrumento
                                        </option>
                                        {instrumentOptions.map((inst, i) => (
                                          <option key={i} value={inst}>
                                            {inst}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                    <input
                                      type="number"
                                      min="1"
                                      className="form-control"
                                      placeholder="Cantidad"
                                      value={copia.quantity}
                                      onChange={(e) =>
                                        handleCopiaChange(
                                          index,
                                          "quantity",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger"
                                      onClick={() => removeCopia(index)}
                                    >
                                      -
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="col-12">
                              <label
                                htmlFor="categoriaOrquesta"
                                className="form-label"
                              >
                                Categoria de Orquesta
                              </label>
                              <select
                                className="form-select"
                                id="categoriaOrquesta"
                                aria-label="Default select example"
                              >
                                <option defaultValue value="Orquesta A">
                                  Orquesta A
                                </option>
                                <option value="Orquesta J">Orquesta J</option>
                                <option value="OSC">OSC</option>
                              </select>
                            </div>
                            <div className="col-12">
                              <label htmlFor="score" className="form-label">
                                Score
                              </label>
                              <select
                                className="form-select"
                                id="score"
                                aria-label="Default select example"
                              >
                                <option selected value="si">
                                  Si
                                </option>
                                <option value="no">No</option>
                              </select>
                              <div className="col-12">
                                <label
                                  htmlFor="observaciones"
                                  className="form-label mt-4"
                                >
                                  Observaciones
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="observaciones"
                                  placeholder="Observaciones"
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-grid">
                                <button className="btn btn-primary">
                                  <i className="bx bx-user"></i>
                                  Crear Partitura
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
        {/* </div> */}
        <ToastContainer />
      </>
    </Layout>
  );
}

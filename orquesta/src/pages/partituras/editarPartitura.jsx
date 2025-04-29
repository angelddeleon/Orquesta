import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../../layout/layout";
import ExpansiveToast from "../../components/ui/expansiveToast";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarPartitura() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [instrumentOptions, setInstrumentOptions] = useState([]);

  // Estados del formulario
  const [obra, setObra] = useState("");
  const [sede, setSede] = useState("");
  const [formato, setFormato] = useState("");
  const [archivista, setArchivista] = useState("");
  const [caja, setCaja] = useState("");
  const [Compositor, setCompositor] = useState([""]);
  const [arrangers, setArrangers] = useState([""]);
  const [orquestacion, setOrquestacion] = useState("");
  const [originales, setOriginales] = useState([]);
  const [copias, setCopias] = useState([]);
  const [categoriaOrquesta, setCategoriaOrquesta] = useState("Orquesta A");
  const [score, setScore] = useState("si");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    const fetchPartitura = async () => {
      try {
        const response = await fetch(
          `https://backend.sinfocarabobo.com/api/partituras/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log(data);
        if (!response.ok)
          throw new Error(data.message || "Error cargando partitura");

        // Transformar datos de la API al formato del estado
        const instrumentOptionsWithoutNew = instrumentOptions.filter(
          (opt) => opt !== "Nuevo..."
        );

        const processInstruments = (instruments) => {
          return instruments.map((inst) => ({
            instrument: inst.Nombre,
            quantity: inst.Cantidad.toString(),
            isNew: !instrumentOptionsWithoutNew.includes(inst.Nombre),
          }));
        };

        // Setear todos los estados con los datos obtenidos
        setObra(data.obra || "");
        setSede(data.sede || "");
        setFormato(data.formato || "");
        setArchivista(data.archivista || "");
        setCaja(data.caja || "");
        setCompositor(
          data.Compositores?.length > 0 ? data.Compositores : ["N/A"]
        );
        setArrangers(data.Arreglistas?.length > 0 ? data.Arreglistas : ["N/A"]);
        setOrquestacion(data.Orquestacion?.join("; ") || "");
        setOriginales(processInstruments(data.Instrumento?.Original || []));
        setCopias(processInstruments(data.Instrumento?.Copia || []));
        setCategoriaOrquesta(data.Categoria || "Orquesta A");
        setScore(data.Score ? "si" : "no");
        setObservaciones(data.observaciones || "");

        setIsLoading(false);
      } catch (error) {
        toast.error(error.message);
        // navigate('/menu')
      }
    };

    fetchPartitura();
  }, []);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch("https://backend.sinfocarabobo.com/api/instrumentos",{
          credentials: "include",
        });
        const data = await response.json();
        // Supongamos que el endpoint retorna un arreglo de objetos con { id, nombre }
        // Agregamos "Nuevo..." manualmente al final de la lista, si lo necesitas.
        setInstrumentOptions([...data.map((inst) => inst.nombre), "Nuevo..."]);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };

    fetchInstruments();
  }, []);
  // Handlers para compositores
  const handleCompositorChange = (index, value) => {
    const newCompositors = [...Compositor];
    newCompositors[index] = value;
    setCompositor(newCompositors);
  };

  const addCompositor = () => setCompositor([...Compositor, ""]);
  const removeCompositor = (index) =>
    setCompositor(Compositor.filter((_, i) => i !== index));

  // Handlers para arreglistas
  const handleArrangerChange = (index, value) => {
    const newArrangers = [...arrangers];
    newArrangers[index] = value;
    setArrangers(newArrangers);
  };

  const addArranger = () => setArrangers([...arrangers, ""]);
  const removeArranger = (index) =>
    setArrangers(arrangers.filter((_, i) => i !== index));

  // Handlers para instrumentos
  const handleInstrumentChange = (type, index, field, value) => {
    const instruments = type === "original" ? [...originales] : [...copias];

    if (field === "instrument") {
      if (value === "Nuevo...") {
        instruments[index] = {
          instrument: "",
          quantity: instruments[index].quantity,
          isNew: true,
        };
      } else {
        const instrumentOptionsWithoutNew = instrumentOptions.filter(
          (opt) => opt !== "Nuevo..."
        );
        const isExisting = instrumentOptionsWithoutNew.includes(value);
        instruments[index] = {
          instrument: value,
          quantity: instruments[index].quantity,
          isNew: !isExisting,
        };
      }
    } else {
      instruments[index][field] = value;
    }

    type === "original" ? setOriginales(instruments) : setCopias(instruments);
  };

  const addInstrument = (type) => {
    const newInstrument = { instrument: "", quantity: "", isNew: false };
    type === "original"
      ? setOriginales([...originales, newInstrument])
      : setCopias([...copias, newInstrument]);
  };

  const removeInstrument = (type, index) => {
    type === "original"
      ? setOriginales(originales.filter((_, i) => i !== index))
      : setCopias(copias.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      Obra: obra,
      Archivista: archivista,
      Caja: caja,
      Sede: sede,
      Compositores: Compositor.filter((c) => c.trim() !== ""),
      Arreglistas: arrangers.filter((a) => a.trim() !== ""),
      Orquestacion: orquestacion.split(";").map((item) => item.trim()),
      Formato: formato,
      Instrumentos: {
        Original: originales.map((o) => ({
          Nombre: o.instrument,
          Cantidad: Number(o.quantity),
        })),
        Copia: copias.map((c) => ({
          Nombre: c.instrument,
          Cantidad: Number(c.quantity),
        })),
      },
      Categoria: categoriaOrquesta,
      Score: score === "si",
      Observaciones: observaciones,
    };

    try {
      const response = await fetch(
        `https://backend.sinfocarabobo.com/api/partituras/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Error actualizando partitura");

      toast.success("Partitura actualizada con éxito", {
        onClose: () => navigate("/menu"),
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(
        <ExpansiveToast
          title="Error actualizando partitura"
          content={<p className="mb-2 fs-6">{error.message}</p>}
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

  if (isLoading)
    return (
      <Layout>
        <div className="text-center my-5">Cargando partitura...</div>
      </Layout>
    );

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
                  <h1>Editar Partitura</h1>
                  <small className="text-secondary">
                    Modifique los campos necesarios y presione el botón para
                    guardar
                  </small>
                </div>

                <div className="card-body">
                  <div className="p-4">
                    <form className="row g-3" onSubmit={handleSubmit}>
                      <div className="col-sm-6">
                        <label htmlFor="archivista" className="form-label">
                          Archivista
                        </label>
                        <input
                          type="text"
                          placeholder="Jose"
                          className="form-control"
                          id="archivista"
                          value={archivista}
                          onChange={(e) => setArchivista(e.target.value)}
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
                          value={caja}
                          onChange={(e) => setCaja(e.target.value)}
                          placeholder="Caja"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Compositores</label>
                        {Compositor.map((Compositor, index) => (
                          <div
                            className="input-group mb-2"
                            key={`Compositor-${index}`}
                          >
                            <input
                              type="text"
                              className="form-control"
                              value={Compositor}
                              onChange={(e) =>
                                handleCompositorChange(index, e.target.value)
                              }
                              placeholder={`Compositor ${index + 1}`}
                            />
                            {index === arrangers.length - 1 && (
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
                          <option value="U.J.A.P">
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
                          id="obra"
                          required
                          value={formato}
                          onChange={(e) => setFormato(e.target.value)}
                        />
                      </div>

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
                                handleArrangerChange(index, e.target.value)
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
                              >
                                -
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="col-12">
                        <label htmlFor="orquestacion" className="form-label">
                          Orquestación
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="orquestacion"
                          value={orquestacion}
                          onChange={(e) => setOrquestacion(e.target.value)}
                          placeholder="Separar por punto y coma (;)"
                        />
                      </div>

                      <div className="col-12">
                        <label className="mb-4">Instrumentos</label>
                        <div className="mb-4">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <label className="form-label me-2">Original</label>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => addInstrument("original")}
                            >
                              +
                            </button>
                          </div>
                          {originales.map((original, index) => {
                            // Total de ocurrencias del mismo instrumento seleccionado
                            const totalOccurrences = originales.filter(
                              (o) =>
                                o.instrument === original.instrument &&
                                o.instrument !== ""
                            ).length;
                            // Secuencia: número de la ocurrencia actual (1, 2, 3, ...)
                            const sequence = originales.filter(
                              (o, i) =>
                                o.instrument === original.instrument &&
                                o.instrument !== "" &&
                                i <= index
                            ).length;
                            // Si hay más de una ocurrencia se muestra la secuencia; sino, nada
                            const counter =
                              totalOccurrences > 1 ? (
                                <span className="input-group-text">
                                  {sequence}
                                </span>
                              ) : null;

                            return (
                              <div
                                className="input-group mb-2"
                                key={`original-${index}`}
                              >
                                {/* Se coloca el contador a la izquierda */}
                                {counter}
                                {original.isNew ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nuevo instrumento"
                                    value={original.instrument}
                                    required
                                    onChange={(e) =>
                                      handleInstrumentChange(
                                        "original",
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
                                      handleInstrumentChange(
                                        "original",
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
                                    handleInstrumentChange(
                                      "original",
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={() =>
                                    removeInstrument("original", index)
                                  }
                                >
                                  -
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        <hr />
                        <div className="mb-4">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <label className="form-label me-2">Copia</label>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => addInstrument("copia")}
                            >
                              +
                            </button>
                          </div>
                          {copias.map((copia, index) => {
                            const totalOccurrences = copias.filter(
                              (o) =>
                                o.instrument === copia.instrument &&
                                o.instrument !== ""
                            ).length;
                            const sequence = copias.filter(
                              (o, i) =>
                                o.instrument === copia.instrument &&
                                o.instrument !== "" &&
                                i <= index
                            ).length;
                            const counter =
                              totalOccurrences > 1 ? (
                                <span className="input-group-text">
                                  {sequence}
                                </span>
                              ) : null;

                            return (
                              <div
                                className="input-group mb-2"
                                key={`copia-${index}`}
                              >
                                {counter}
                                {copia.isNew ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nuevo instrumento"
                                    value={copia.instrument}
                                    required
                                    onChange={(e) =>
                                      handleInstrumentChange(
                                        "copia",
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
                                      handleInstrumentChange(
                                        "copia",
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
                                    handleInstrumentChange(
                                      "copia",
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={() =>
                                    removeInstrument("copia", index)
                                  }
                                >
                                  -
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="col-12">
                        <label
                          htmlFor="categoriaOrquesta"
                          className="form-label"
                        >
                          Categoría de Orquesta
                        </label>
                        <select
                          className="form-select"
                          id="categoriaOrquesta"
                          value={categoriaOrquesta}
                          onChange={(e) => setCategoriaOrquesta(e.target.value)}
                        >
                          <option value="Orquesta A">Orquesta A</option>
                          <option value="Orquesta J">Orquesta J</option>
                          <option value="OSC">OSC</option>
                          <option value="Orquesta Típica">
                            Orquesta Típica
                          </option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label htmlFor="score" className="form-label">
                          Score
                        </label>
                        <select
                          className="form-select"
                          id="score"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                        >
                          <option value="si">Si</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label
                          htmlFor="observaciones"
                          className="form-label mt-4"
                        >
                          Observaciones
                        </label>
                        <textarea
                          className="form-control"
                          id="observaciones"
                          value={observaciones}
                          onChange={(e) => setObservaciones(e.target.value)}
                          placeholder="Observaciones"
                          rows="3"
                        />
                      </div>

                      <div className="col-12">
                        <div className="d-grid">
                          <button type="submit" className="btn btn-primary">
                            Actualizar Partitura
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
        <ToastContainer />
      </div>
    </Layout>
  );
}

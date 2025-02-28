import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
export default function NewPartitura() {
    // Opciones para instrumentos.PLACEHOLDER, debe venir del backend?
    const instrumentOptions = [
        'Violín',
        'Viola',
        'Violonchelo',
        'Contrabajo',
        'Flauta',
        'Oboe',
        'Clarinete',
        'Fagot',
        'Trompeta',
        'Trombón',
        'Tuba',
        'Percusión',
        'Arpa',
        'Piano',
    ]

    // estado de Compositores
    const [compositor, setCompositor] = useState([''])

    //Spread Operator para agregar compositores
    const addCompositor = () => setCompositor([...compositor, ''])

    //Remueve en base al index
    const removeCompositor = (indexToRemove: number) => {
        setCompositor(compositor.filter((_, index) => index !== indexToRemove))
    }
    //Handler para agregar compositores
    const handleCompositorChange = (index: number, value: string) => {
        const newcompositor = [...compositor]
        newcompositor[index] = value
        setCompositor(newcompositor)
    }

    // estado Arreglistas
    const [arrangers, setArrangers] = useState([''])

    //Spread Operator para agregar compositores
    const addArranger = () => setArrangers([...arrangers, ''])

    //Remueve en base al index
    const removeArranger = (indexToRemove: number) => {
        setArrangers(arrangers.filter((_, index) => index !== indexToRemove))
    }

    //Handler para agregar arreglistas
    const handleArrangerChange = (index: number, value: string) => {
        const newArrangers = [...arrangers]
        newArrangers[index] = value
        setArrangers(newArrangers)
    }

    // Estados para instrumentos
    const [originales, setOriginales] = useState<{ instrument: string; quantity: string }[]>([])
    const [copias, setCopias] = useState<{ instrument: string; quantity: string }[]>([])

    // Handlers para Originales
    const addOriginal = () => setOriginales([...originales, { instrument: '', quantity: '' }])
    const removeOriginal = (index) => setOriginales(originales.filter((_, i) => i !== index))
    const handleOriginalChange = (index, field, value) => {
        const newOriginales = [...originales]
        newOriginales[index][field] = value
        setOriginales(newOriginales)
    }

    // Handlers para Copias
    const addCopia = () => setCopias([...copias, { instrument: '', quantity: '' }])
    const removeCopia = (index) => setCopias(copias.filter((_, i) => i !== index))
    const handleCopiaChange = (index, field, value) => {
        const newCopias = [...copias]
        newCopias[index][field] = value
        setCopias(newCopias)
    }

    // Manejador de envío del formulario
    const handleSubmit = (event) => {
        event.preventDefault()
        toast.success('Partitura creada con éxito')
    }
    return (
        // <Layout>
        <>
            <div className="wrapper">
                <div className="d-flex align-items-center justify-content-center my-5 my-lg-0">
                    <div className="container-fluid">
                        <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
                            <div className="col mx-auto">
                                <div className="my-4 text-center">
                                    <p className="fw-bold text-nowrap text-primary">ORQUESTA SINFÓNICA DE CARABOBO</p>
                                    <h1>Nueva Partitura</h1>
                                    <small className="text-secondary">
                                        Rellene todo el siguiente formulario y una vez finalizado presione el boton
                                    </small>
                                </div>
                                <div className="">
                                    <div className="card-body">
                                        <div className="p-4 rounded">
                                            <div className="form-body">
                                                <form className="row g-3" onSubmit={handleSubmit}>
                                                    <div className="col-sm-6">
                                                        <label htmlFor="archivero" className="form-label">
                                                            Archivero
                                                        </label>
                                                        <input type="text" className="form-control" id="archivero" placeholder="A" />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor="inputLastName" className="form-label">
                                                            Caja
                                                        </label>
                                                        <input type="text" className="form-control" id="inputLastName" placeholder="001" />
                                                    </div>
                                                    {/* Compositores */}
                                                    <div className="col-12">
                                                        <label className="form-label">Compositores</label>
                                                        {compositor.map((Compositor, index) => (
                                                            <div className="input-group mb-2" key={`Compositor-${index}`}>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={Compositor}
                                                                    onChange={(e) => handleCompositorChange(index, e.target.value)}
                                                                    placeholder={`Compositor ${index + 1}`}
                                                                />
                                                                {index === compositor.length - 1 && (
                                                                    <button type="button" className="btn btn-outline-primary" onClick={addCompositor}>
                                                                        +
                                                                    </button>
                                                                )}
                                                                {index > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger"
                                                                        onClick={() => removeCompositor(index)}
                                                                        disabled={Compositor.trim() !== ''}>
                                                                        -
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Arreglistas */}
                                                    <div className="col-12">
                                                        <label className="form-label">Arreglistas</label>
                                                        {arrangers.map((arranger, index) => (
                                                            <div className="input-group mb-2" key={`arranger-${index}`}>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={arranger}
                                                                    onChange={(e) => handleArrangerChange(index, e.target.value)}
                                                                    placeholder={`Arreglista ${index + 1}`}
                                                                />
                                                                {index === arrangers.length - 1 && (
                                                                    <button type="button" className="btn btn-outline-primary" onClick={addArranger}>
                                                                        +
                                                                    </button>
                                                                )}
                                                                {index > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger"
                                                                        onClick={() => removeArranger(index)}
                                                                        disabled={arranger.trim() !== ''}>
                                                                        -
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="col-12">
                                                        <label htmlFor="" className="mb-4">
                                                            Instrumentos
                                                        </label>
                                                        {/* Sección Originales */}
                                                        <div className="mb-4">
                                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                                <label className="form-label me-2">Original</label>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={addOriginal}>
                                                                    +
                                                                </button>
                                                            </div>
                                                            {originales.map((original, index) => (
                                                                <div className="input-group mb-2" key={`original-${index}`}>
                                                                    <select
                                                                        className="form-select"
                                                                        value={original.instrument}
                                                                        onChange={(e) => handleOriginalChange(index, 'instrument', e.target.value)}>
                                                                        <option value="">Seleccionar instrumento</option>
                                                                        {instrumentOptions.map((inst, i) => (
                                                                            <option key={i} value={inst}>
                                                                                {inst}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        className="form-control"
                                                                        placeholder="Cantidad"
                                                                        value={original.quantity}
                                                                        onChange={(e) => handleOriginalChange(index, 'quantity', e.target.value)}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger"
                                                                        onClick={() => removeOriginal(index)}>
                                                                        -
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <hr />
                                                        {/* Sección Copias */}
                                                        <div className="mb-4">
                                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                                <label className="form-label me-2">Copia</label>
                                                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={addCopia}>
                                                                    +
                                                                </button>
                                                            </div>
                                                            {copias.map((copia, index) => (
                                                                <div className="input-group mb-2" key={`copia-${index}`}>
                                                                    <select
                                                                        className="form-select"
                                                                        value={copia.instrument}
                                                                        onChange={(e) => handleCopiaChange(index, 'instrument', e.target.value)}>
                                                                        <option value="">Seleccionar instrumento</option>
                                                                        {instrumentOptions.map((inst, i) => (
                                                                            <option key={i} value={inst}>
                                                                                {inst}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        className="form-control"
                                                                        placeholder="Cantidad"
                                                                        value={copia.quantity}
                                                                        onChange={(e) => handleCopiaChange(index, 'quantity', e.target.value)}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger"
                                                                        onClick={() => removeCopia(index)}>
                                                                        -
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="col-12">
                                                        <label htmlFor="categoriaOrquesta" className="form-label">
                                                            Categoria de Orquesta
                                                        </label>
                                                        <select className="form-select" id="categoriaOrquesta" aria-label="Default select example">
                                                            <option selected value="Orquesta A">
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
                                                        <select className="form-select" id="score" aria-label="Default select example">
                                                            <option selected value="si">
                                                                Si
                                                            </option>
                                                            <option value="no">No</option>
                                                        </select>
                                                        <div className="col-12">
                                                            <label htmlFor="observaciones" className="form-label mt-4">
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
        // </Layout>
    )
}

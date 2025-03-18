import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function Imprimir() {
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad de la modal
    const [selectedOptions, setSelectedOptions] = useState({}); // Estado para almacenar las opciones seleccionadas

    // Función para abrir la modal
    const handleOpenModal = () => setShowModal(true);

    // Función para cerrar la modal
    const handleCloseModal = () => setShowModal(false);

    // Función para manejar el cambio en las opciones seleccionadas
    const handleOptionChange = (title, option) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [title]: option,
        }));
    };

    // Función para enviar la solicitud de impresión
    const handleImprimir = async () => {
        try {
            const response = await fetch("/api/imprimir", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedOptions),
            });

            if (!response.ok) {
                throw new Error("Error al enviar la solicitud de impresión");
            }

            alert("Solicitud de impresión enviada correctamente");
            handleCloseModal(); // Cerrar la modal después de enviar la solicitud
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un error al enviar la solicitud de impresión");
        }
    };

    return (
        <>
            {/* Botón para abrir la modal */}
            <Button className="btn btn-primary" onClick={handleOpenModal}>
                <i className="fa-solid fa-arrow-up me-2"></i>
                Imprimir
            </Button>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Exportar / Imprimir</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Lista de opciones */}
                        {["U.J.A.P", "Av. Bolivar", "Hesperia"].map((title) => (
                            <div key={title} className="d-flex justify-content-between align-items-center mb-3">
                                <strong>{title}</strong>
                                <div>
                                    {["Propiedad", "Prestadas", "Todas"].map((option) => (
                                        <Form.Check
                                            key={option}
                                            type="radio"
                                            inline
                                            label={option}
                                            name={title}
                                            value={option}
                                            checked={selectedOptions[title] === option}
                                            onChange={() => handleOptionChange(title, option)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleImprimir}>
                        Imprimir
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function Imprimir() {
    const [showModal, setShowModal] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [loading, setLoading] = useState(false);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleOptionChange = (title, option) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [title]: option,
        }));
    };

    const generatePDF = async (partituras) => {
        try {
            const { jsPDF } = await import("jspdf");
            const autoTable = (await import("jspdf-autotable")).default;

            const doc = new jsPDF({
                unit: 'mm',
                format: 'a4'
            });

            const logoUrl = '/brand/logo.webp';
            const logoResponse = await fetch(logoUrl);
            const logoBlob = await logoResponse.blob();
            const logoDataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(logoBlob);
            });

            const logoSize = 50; // Tamaño cuadrado para el logo
            const logoX = (doc.internal.pageSize.getWidth() - logoSize) / 2; // Centrado

            doc.addImage(logoDataUrl, 'WEBP', logoX, 10, logoSize, logoSize);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Listado de Partituras", 105, 70, { align: 'center' }); // Ajustar Y para evitar superposición
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 105, 75, { align: 'center' }); // Ajustar Y para evitar superposición

            const headers = [
                "Obra", 
                "Caja", 
                "Sede", 
                "Compositores", 
                "Arreglistas", 
                "Orquestación",
                "Instrumentos Originales",
                "Instrumentos Copias",
                "Categoría",
                "Archivista"
            ];

            const body = partituras.map(partitura => [
                partitura.obra || '-',
                partitura.caja || '-',
                partitura.sede || '-',
                partitura.compositores?.join(", ") || '-',
                partitura.arreglistas?.join(", ") || '-',
                partitura.orquestacion?.join(", ") || '-',
                partitura.instrumentos?.originales?.map(i => `${i.nombre} (${i.cantidad})`).join(", ") || '-',
                partitura.instrumentos?.copias?.map(i => `${i.nombre} (${i.cantidad})`).join(", ") || '-',
                partitura.categoria || '-',
                partitura.archivista || '-'
            ]);

            const margin = 10; 
            const tableWidth = doc.internal.pageSize.getWidth() - (margin * 2); // Ancho de la tabla

            autoTable(doc, {
                startY: 80, // Ajustar Y para evitar superposición
                head: [headers],
                body: body,
                margin: { left: margin, right: margin },
                tableWidth: tableWidth, // Usar el ancho calculado
                styles: {
                    fontSize: 8,
                    cellPadding: 3,
                    overflow: 'linebreak',
                    font: 'helvetica',
                    valign: 'middle',
                    halign: 'center' // Alineación horizontal centrada
                },
                headStyles: {
                    fillColor: [199, 174, 31], // Color #C7AE1F
                    textColor: 255,
                    fontSize: 8, // Reducir tamaño de fuente
                    fontStyle: 'bold',
                    halign: 'center'
                },
                bodyStyles: {
                    halign: 'left',
                    valign: 'middle'
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 'auto' },
                    3: { cellWidth: 'auto' },
                    4: { cellWidth: 'auto' },
                    5: { cellWidth: 'auto' },
                    6: { cellWidth: 'auto' },
                    7: { cellWidth: 'auto' },
                    8: { cellWidth: 'auto' },
                    9: { cellWidth: 'auto' }
                },
                didDrawPage: function(data) {
                    doc.setFontSize(8);
                    doc.setTextColor(100);
                    doc.text(
                        `Página ${data.pageCount}`,
                        data.settings.margin.left,
                        doc.internal.pageSize.getHeight() - 10
                    );
                }
            });

            doc.save(`partituras_${new Date().toISOString().slice(0,10)}.pdf`);

        } catch (error) {
            console.error("Error al generar PDF:", error);
            throw new Error("Error al generar el documento PDF");
        }
    };

    const handleImprimir = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:3000/api/partituras/all", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...selectedOptions,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error("Error al obtener las partituras");
            }

            const { data } = await response.json();
            
            if (!data || !Array.isArray(data)) {
                throw new Error("Formato de datos incorrecto");
            }

            await generatePDF(data);
            handleCloseModal();
        } catch (error) {
            console.error("Error:", error);
            alert(error.message || "Hubo un error al generar el PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button className="btn btn-primary" onClick={handleOpenModal}>
                <i className="fa-solid fa-arrow-up me-2"></i>
                Imprimir
            </Button>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Exportar / Imprimir</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    {["U.J.A.P", "Av. Bolivar", "Hesperia"].map((title) => (
                            <div key={title} className="d-flex justify-content-between align-items-center mb-3">
                                <strong>{title}</strong>
                                <div>
                                {["Todas", "Ninguna"].map((option) => (  // Añadida opción "Ninguna"
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
                    <Button variant="primary" onClick={handleImprimir} disabled={loading}>
                        {loading ? "Generando PDF..." : "Generar PDF"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
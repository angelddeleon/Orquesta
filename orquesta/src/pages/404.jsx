import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate(); // Hook para la navegación

    // Función para redirigir a /menu
    const handleRedirect = () => {
        navigate("/menu");
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                textAlign: "center",
                backgroundColor: "#f8f9fa",
            }}
        >
            <h1 style={{ fontSize: "4rem", color: "#dc3545", marginBottom: "1rem" }}>
                404
            </h1>
            <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
                Página no encontrada
            </p>
            <button
                onClick={handleRedirect}
                style={{
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Volver al Menú
            </button>
        </div>
    );
}
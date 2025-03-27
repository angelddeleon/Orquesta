// components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/usuarios/verificarToken', {
          credentials: 'include', // Para enviar cookies
        });
        
        const data = response.status === 200 ? true : false;
        setIsAuthenticated(data);
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>; // O un spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
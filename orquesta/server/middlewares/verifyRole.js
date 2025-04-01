import db from "../config/db.js";

const allowedRoles = ['admin', 'archivero'];

export const verifyRole = () => {
    return async (req, res, next) => {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        try {
            const [rows] = await db.execute(
                "SELECT role FROM users WHERE id = ?",
                [req.user.id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const userRole = rows[0].role;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ 
                    error: 'Acceso no autorizado',
                    message: `Necesitas uno de estos roles: ${allowedRoles.join(', ')}`,
                    currentRole: userRole
                });
            }

            //paRa el siguiennte
            next();

        } catch (error) {
            console.error("Error al verificar el rol:", error);
            return res.status(500).json({ error: 'Error al verificar permisos' });
        }
    };
};
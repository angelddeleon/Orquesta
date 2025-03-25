import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // Obtener el token de la cookie llamada 'token'
    const token = req.cookies.token;
    console.log("Token " + token)

    if (!token) {
        return res.status(401).json({ error: 'No hay token. Inicia sesión' });
    }

    // Verificar y decodificar el token
    jwt.verify(token, 'secreto', (err, decoded) => {
        if (err) {
            res.clearCookie('token', {  // Limpiar la cookie si el token es inválido
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                path: '/'
            });
            return res.status(401).json({ error: 'Token inválido' });
        }

        // El token es válido, por lo que podemos pasar la información decodificada a la siguiente parte de la lógica
        req.user = decoded;  // El decoded contiene la información del usuario (incluido userId)

        next();  // Continuar con la solicitud
    });
};

export default verifyToken;

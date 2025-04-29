const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Obtener el token de la cookie llamada 'token'
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'No hay token. Inicia sesión' });
    }

    jwt.verify(token, 'secreto', (err, decoded) => {
        if (err) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                path: '/'
            });
            // Envía un código o mensaje para que el frontend redirija
            return res.status(401).json({ 
                error: 'Token inválido',
                redirectTo: '/' 
            });
        }
    
        req.user = decoded;
        
        next();
    });
};

module.exports = { verifyToken };

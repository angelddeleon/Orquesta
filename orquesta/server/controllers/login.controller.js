
import db from "../config/db.js";

export const loginDB = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE email = ? AND password = ?",
            [email, password]
        );

        if (rows.length > 0) {
            res.status(200).json({ message: "Login exitoso", user: rows[0] });
        } else {
            res.status(401).json({ message: "Credenciales inválidas" });
        }
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// controllers/authController.js

//Testear sin DB
const users = [
    { email: "usuario1@example.com", password: "password1" },
    { email: "usuario2@example.com", password: "password2" }
];

export const loginTest = (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.status(200).json({ message: "Login exitoso", user });
    } else {
        res.status(401).json({ message: "Credenciales inválidas" });
    }
};
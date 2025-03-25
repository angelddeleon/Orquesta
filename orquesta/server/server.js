import app from "./app.js";
import process from "process";


const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
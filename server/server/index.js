import { app } from "./app";
import { connectDB } from "./db.js";
import { PORT } from "./config.js";

connectDB();
app.listen(PORT);
console.log("Servidor funcionando en puerto:", PORT);
import { server } from "./app";
import { connectDB } from "./db.js";
import { PORT } from "./config.js";

connectDB();
server.listen(PORT);
console.log("Servidor funcionando en puerto:", PORT);
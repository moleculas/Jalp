import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import fileUpload from "express-fileupload";
import postsRoutes from "./routes/posts.routes";
import indexRoutes from "./routes/index.routes";
import authRoutes from "./routes/auth.routes";
import mailsRoutes from "./routes/mails.routes";
import usuariosRoutes from "./routes/usuarios.routes";
import calendarRoutes from "./routes/calendar.routes";
import chatRoutes from "./routes/chat.routes";
import notesRoutes from "./routes/notes.routes";
import tasksRoutes from "./routes/tasks.routes";
import filesRoutes from "./routes/files.routes";
import actividadRoutes from "./routes/actividad.routes";
import escandalloRoutes from "./routes/escandallo.routes";
import produccionRoutes from "./routes/produccion.routes";
import pedidoRoutes from "./routes/pedido.routes";
import cotizacionRoutes from "./routes/cotizacion.routes";
import productoRoutes from "./routes/producto.routes";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: "*",
    },
});

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//files
app.use(
    fileUpload({
        tempFileDir: "./upload",
        useTempFiles: true,
    })
);

//routes
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/mails', mailsRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/actividad', actividadRoutes);
app.use('/api/escandallo', escandalloRoutes);
app.use('/api/produccion', produccionRoutes);
app.use('/api/pedido', pedidoRoutes);
app.use('/api/cotizacion', cotizacionRoutes);
app.use('/api/producto', productoRoutes);

//sockets
io.on('connection', (socket) => {
    socket.on("comunicacion", (body) => {
        socket.broadcast.emit("comunicacion", {
            body,
            from: socket.id.slice(8),
        });
    });
});

export { app, server };
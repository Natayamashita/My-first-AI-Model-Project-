import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const model = new LlamaModel({
    modelPath: path.join(__dirname, "models", "notus-7b-v1.Q4_K_M.gguf")
});

const app = express();
const server = createServer(app);

// Create Socket.io server instance
const io = new Server(server, { cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'XContent-Type', 'Depth, User-Agent', 'X-File-Size', 'X-Requested-With', 'If-Modified-Since', 'X-File-Name', 'Cache-Control'],
    credentials: true
}
});

const context = new LlamaContext({ model });
const session = new LlamaChatSession({ context });

io.on("connection", async (socket) => {
    console.log("There's a new connection");

    // Emit initial response when a client connects
    //socket.emit('response', await session.prompt('Hello'));

    // Handle incoming messages from the client
    socket.on('message', async (msg) => {
        console.log(msg, 'MENSAGEM RECEBIDA')
        const botReply = await session.prompt(msg);
        console.log(botReply)
        socket.emit('response', botReply);
    });
});


const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log("Server started on port %d", PORT);
});
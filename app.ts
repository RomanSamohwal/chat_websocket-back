import express from 'express';
import http from 'http';
import socketio from 'socket.io'
//создали сервер
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//взять порт окружения и если не будет задан то взять 7767
//хероку поставит по умолчанию свой порт
let PORT = process.env.PORT || 3009;

app.get('/', (req, res) => {
    res.send('Hello its websocket server');
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(PORT, () => {
    console.log('listening on *:3000');
});
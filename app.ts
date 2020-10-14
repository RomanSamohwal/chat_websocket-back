import express from 'express';
import http from 'http';
import socketio from 'socket.io'
//создали сервер
const app = express();
const server = http.createServer(app);
const socket = socketio(server);

//взять порт окружения и если не будет задан то взять 7767
//хероку поставит по умолчанию свой порт
let PORT = process.env.PORT || 3009;

app.get('/', (req, res) => {
    res.send('Hello its websocket server');

});
const messages: Array<any> = [
    {message: 'Hello Veronica', id: '12345', user: {id: '232323', name: 'Roman'}},
    {message: 'Hello Roman', id: '23456', user: {id: '232323', name: 'Veronica'}}
];

const usersState = new Map();
//сокет подписывется на событие (on) и когда это произойдет он это узнает
//когда пользователь connected должны подписаться на connection
//socketChannel это конкретный socket канал с конкретным пользователем
socket.on('connection', (socketChannel) => {
    console.log(socketChannel)
//подписываемся на событие client-message-sent
// придет сообщение message
    usersState.set(socketChannel, {id: new Date().getTime().toString(), name: 'anonym'});

    socket.on('disconnect', () => {
        usersState.delete(socketChannel)
    });

    socketChannel.on('client-name-sent', (name: string) => {
        const user = usersState.get(socketChannel)
        user.name = name;
    })

    socketChannel.on('client-message-sent', (message: string) => {
        if (typeof message !== 'string') {
            return;
        }
        const user = usersState.get(socketChannel);
        console.log(message);
        let messageItem = {
            message: message, id: new Date().getTime().toString(),
            user: {id: user.id, name: user.name}
        };
        messages.push(messageItem)
//socket emit новое сообщение. Все пользователи уведомляются и получают новое сообщение
        socket.emit('new-message-sent', messageItem)
    });
    socketChannel.emit('init-messages-published', messages)
    console.log('a user connected');
});
//подписываемся на событие client-message-sent
// придет сообщение message
socket.on('client-message-sent', (message: string) => {
    console.log(message);
});

server.listen(PORT, () => {
    console.log('listening on *:3000');
});
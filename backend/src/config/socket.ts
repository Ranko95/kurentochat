import { Server, Socket } from 'socket.io';
import { configureSocket } from '../services/socket/configureSocket';

import { onConnection } from '../services/socket/onConnection';

const socketConfig = Object.freeze({
    pingInterval: 10000,
    pingTimeout: 10000,
});

const io = new Server(socketConfig);

io.on('connection', (socket: Socket) => {
    onConnection(io, socket);
    configureSocket(socket);
});

export { io };

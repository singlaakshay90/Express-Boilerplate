const { socketAuthentication } = require(`../../services/boilerplate/authService`);
const { SOCKET_EVENTS, MESSAGES } = require('../../utils/constants');


let socketConnection = {};
socketConnection.connect = function (io) {
    io.use(socketAuthentication);
    socketConnection.io = io;
    io.on('connection', (socket) => {
        /** middleware for socket event's call logging  */
        socket.use((packet, next) => {
            messageLogs(null, `Socket listen ${(new Date()).toLocaleTimeString()} ${packet[0]}  data : ${JSON.stringify(packet[1])}`);
            next();
        });
        console.log('connection established', socket.id);
        socketConnection.socket = socket;
    });
};



module.exports = socketConnection;
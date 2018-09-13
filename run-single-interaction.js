'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

class Index {
	constructor() {
		this.userData = [];
		app.use(express.static('public'));
		app.get('/', function(req, res){
			res.sendFile(__dirname, '/index.html');
		});
		io.on('connection', (socket) => {
            // save ip address & port
            let remoteAddress = socket.request.connection.remoteAddress;
            let remotePort = socket.request.connection.remotePort;
			console.log('a user connected', socket.id);
            // console.log(socket.handshake);
            this.userData.push({
                id: socket.id,
                remoteAddress: remoteAddress,
                remotePort: remotePort,
                time: socket.handshake.time,
                userAgent: socket.handshake.headers['user-agent']
            });
            console.log(this.userData);
            socket.on('socket connected', () => {
                io.to(socket.id).emit('connection stable', this.userData);
            })
            socket.on('disconnect', () => {
                console.log(socket.id);
                this.userData = this.userData.filter(obj => {
                    return obj.id != socket.id;
                });
            });
		});
		http.listen(3000, () => {
			console.log('listening on *:3000');
		});
	}
}

new Index();

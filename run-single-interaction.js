'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

class Index {
	constructor() {
        this.userData = [];
        this.banList = [];
        this.userCount = 0;
		app.use(express.static('public'));
		app.get('/', function(req, res){
			res.sendFile(__dirname, '/index.html');
		});
		io.on('connection', (socket) => {
            this.userCount++;
            // save ip address & port
            let remoteAddress = socket.request.connection.remoteAddress;
            let remotePort = socket.request.connection.remotePort;
            let personalData = {
                id: socket.id,
                remoteAddress: remoteAddress,
                remotePort: remotePort,
                time: socket.handshake.time,
                userAgent: socket.handshake.headers['user-agent']
            };
            // console.log(socket.handshake);
            this.userData.push(personalData);
            console.log(this.userData);
            socket.on('socket connected', () => {
                io.to(socket.id).emit('connection stable', {
                    personalData: personalData,
                    userData: this.userData
                });
            })
            socket.on('disconnect', () => {
                this.userCount--;
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

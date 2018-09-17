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
            socket.on('socket connected', (data) => {
                // save ip address & port
                let ip = data;
                let remotePort = socket.request.connection.remotePort;
                let personalData = {
                    id: socket.id,
                    ip: ip,
                    remotePort: remotePort,
                    time: socket.handshake.time,
                    userAgent: socket.handshake.headers['user-agent']
                };
                // check if user is banned, and kick them off
                let isUserBanned = this.banList.filter(obj => {
                    return obj.ip == personalData.ip;
                });
                // console.log(isUserBanned);
                if (isUserBanned.length !== 0) {
                    io.to(socket.id).emit('you have been banned', false);
                } else {
                    // Otherwise, do our thing
                    this.userCount++;
                    io.emit('user count update', this.userCount);
                    this.userData.push(personalData);
                    io.to(socket.id).emit('connection stable', {
                        personalData: personalData,
                        userData: this.userData
                    });
                    socket.on('kill user', (data) => {
                        this.banList.push(data);
                        let banTheseDevices = this.userData.filter(obj => {
                            return obj.ip == data.ip;
                        });
                        for (let i = 0; i < banTheseDevices.length; i++) {
                            console.log('we should be banning: ', banTheseDevices[i].id);
                            io.to(banTheseDevices[i].id).emit('refresh');
                        }
                    });
                    socket.on('disconnect', () => {
                        this.userCount--;
                        io.emit('user count update', this.userCount);
                        this.userData = this.userData.filter(obj => {
                            return obj.id != socket.id;
                        });
                    });
                }
            });
		});
		http.listen(3369, () => {
			console.log('listening on *:3369');
		});
	}
}

new Index();

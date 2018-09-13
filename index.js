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
			console.log(socket);
			this.userData.push({
				id: socket.id
			});
			console.log('a user connected', socket.id);
		});
		http.listen(3000, () => {
			console.log('listening on *:3000');
		});
	}
}

new Index();
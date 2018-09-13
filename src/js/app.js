'use strict';

const findIp = require('./find-ip');
var socket = io({
    autoConnect: false
});

class App {
	constructor() {
		let ipPromise = new findIp();
		ipPromise.then(ip => {
			console.log('ip: ', ip);
		});
        socket.open();
        socket.emit('socket connected');
        socket.on('connection stable', function(data) {
            let randomData = data[Math.floor(Math.random() * data.length)];
            console.log(randomData);
            let string = `User with ID ${randomData.id} connected from IP address ${randomData.remoteAddress} at ${randomData.time} using ${randomData.userAgent}`;
            document.querySelector('h1').innerText = string;
        });
	}
}

new App();

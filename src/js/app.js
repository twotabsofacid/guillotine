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
            data.userData = data.userData.filter(obj => {
                return obj.remoteAddress != data.personalData.remoteAddress;
            });
            if (data.userData.length !== 0) {
                let randomData = data.userData[Math.floor(Math.random() * data.userData.length)];
                console.log(randomData);
                let string = `User with ID ${randomData.id} connected from IP address ${randomData.remoteAddress} at ${randomData.time} using ${randomData.userAgent}`;
                document.querySelector('h1').innerText = string;
            } else {
                document.querySelector('h1').innerText = 'Sorry, you are the only user at the moment. Please refresh when the user count increases';
            }
        });
	}
}

new App();

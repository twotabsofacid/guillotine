'use strict';

const findIp = require('./find-ip');
var socket = io({
    autoConnect: false
});

class App {
	constructor() {
        this.personalData = null;
        this.userData = null;
        this.targetData = null;
        this.userInfoElem = document.getElementById('user-information');
        this.killBtnElem = document.getElementById('kill-button');
        // Front end listeners
        this.killUser = this.killUser.bind(this);
		let ipPromise = new findIp();
		ipPromise.then(ip => {
			console.log('ip: ', ip);
		});
        socket.open();
        socket.emit('socket connected');
        this.addSocketListeners();
	}
    addSocketListeners() {
        // Run once connection is stable,
        // to get all the info from the server
        socket.on('connection stable', (data) => {
            this.connectionStable(data);
        });
        socket.on('you have been banned', (data) => {
            this.banned(data);
        });
        socket.on('refresh', () => {
            this.refresh();
        });
    }
    addListeners() {
        this.killBtnElem.addEventListener('click', this.killUser);
    }
    connectionStable(data) {
        this.addListeners();
        this.personalData = data.personalData;
        this.userData = data.userData;
        this.userData = this.userData.filter(obj => {
            return obj.remoteAddress != this.personalData.remoteAddress;
        });
        if (this.userData.length !== 0) {
            this.targetData = this.userData[Math.floor(Math.random() * this.userData.length)];
            console.log(this.targetData);
            let string = `<span class="user-id">User with ID ${this.targetData.id}</span> <span class="user-ip">connected from IP address ${this.targetData.remoteAddress}</span> <span class="user-time">at ${this.targetData.time}</span> <span class="user-device">using ${this.targetData.userAgent}</span>`;
            this.userInfoElem.innerHTML = string;
        } else {
            this.userInfoElem.innerText = 'Sorry, you are the only user at the moment. Please refresh when the user count increases';
        }
    }
    banned(data) {
        console.log('should be banned');
        socket.close();
    }
    refresh() {
        console.log('should reload');
        document.location.reload();
    }
    killUser(e) {
        if (e) {
            e.preventDefault();
        }
        if (this.targetData) {
            socket.emit('kill user', this.targetData);
            console.log('should be killing this guy', this.targetData);
            this.refresh();
        }
    }
}

new App();

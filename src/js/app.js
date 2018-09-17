'use strict';

// Other modules
const noScroll = require('no-scroll');
const findIp = require('./find-ip');
const guillotineAnimation = require('./guillotine-animation');
var socket = io({
    autoConnect: false
});

class App {
	constructor() {
        this.personalData = null;
        this.userData = null;
        this.targetData = null;
        this.userInfoElem = document.getElementById('user-information');
        // this.killBtnElem = document.getElementById('kill-button');
        this.userCount = document.getElementById('user-count');
        this.deathScreen = document.getElementById('death-screen');
        // Front end listeners
        // this.killUser = this.killUser.bind(this);
        this.onWindowScroll = this.onWindowScroll.bind(this);
		let ipPromise = new findIp();
		ipPromise.then(ip => {
			console.log('ip: ', ip);
            socket.open();
            socket.emit('socket connected', ip);
            this.addSocketListeners();
		}, err => {
            console.log(err);
            noScroll.on();
            this.deathScreen.querySelector('.death-text.killed').innerText = err;
            this.deathScreen.style.display = 'flex';
        });
	}
    addSocketListeners() {
        // Run once connection is stable,
        // to get all the info from the server
        socket.on('connection stable', (data) => {
            this.connectionStable(data);
        });
        socket.on('user count update', (data) => {
            this.onUserCountUpdate(data);
        });
        socket.on('you have been banned', (data) => {
            this.banned(data);
        });
        socket.on('refresh', () => {
            this.refresh();
        });
    }
    addListeners() {
        window.addEventListener('scroll', this.onWindowScroll);
        // this.killBtnElem.addEventListener('click', this.killUser);
    }
    connectionStable(data) {
        this.addListeners();
        this.personalData = data.personalData;
        this.userData = data.userData;
        this.userData = this.userData.filter(obj => {
            return obj.ip != this.personalData.ip;
        });
        if (this.userData.length !== 0) {
            this.targetData = this.userData[Math.floor(Math.random() * this.userData.length)];
            console.log(this.targetData);
            let string = `<span class="user-info-block user-id">User with ID ${this.targetData.id}</span> <span class="user-info-block user-ip">connected from IP address ${this.targetData.ip}</span> <span class="user-info-block user-time">at ${this.targetData.time}</span> <span class="user-info-block user-device"><span class="inner-text">using ${this.targetData.userAgent}</span></span>`;
            this.userInfoElem.innerHTML = string;
            new guillotineAnimation();
        } else {
            this.userInfoElem.innerText = 'Sorry, you are the only unique IP at the moment. Please refresh when the user count increases.';
        }
    }
    onUserCountUpdate(data) {
        this.userCount.innerText = data;
    }
    banned(data) {
        console.log('should be banned');
        socket.close();
        noScroll.on();
        this.deathScreen.style.display = 'flex';
    }
    refresh() {
        window.scrollTo(0, 0);
        console.log('should reload');
        document.location.reload();
    }
    onWindowScroll(e) {
        if (window.scrollY + window.innerHeight + 10 > document.body.offsetHeight) {
            window.removeEventListener('scroll', this.onWindowScroll);
            console.log('we should delete');
            this.killUser();
        }
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

'use strict';

const findIp = require('./find-ip');

class App {
	constructor() {
		let ipPromise = new findIp();
		ipPromise.then(ip => {
			console.log('ip: ', ip);
		});
	}
}

new App();
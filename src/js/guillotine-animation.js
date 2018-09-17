'use strict';

const Utils = require('./utils');

class GuillotineAnimation {
    constructor() {
        this.blade = document.getElementById('guillotine-svg');
        this.userDeviceTextWrapper = document.querySelector('.user-info-block.user-device');
        this.userDeviceText = document.querySelector('.user-info-block.user-device .inner-text');
        this.onWindowScroll = this.onWindowScroll.bind(this);
        this.timeline = null;
        if (this.userDeviceText) {
            this.addListeners();
            this.addTimeline();
        }
    }
    addListeners() {
        window.addEventListener('scroll', this.onWindowScroll);
    }
    addTimeline() {
        this.timeline = new TimelineLite();
        this.timeline.set(this.userDeviceText, {
            y: 0,
            rotation: '0deg'
        });
        this.timeline.to(this.userDeviceText, 1, {
            ease: Power0.easeNone,
            y: 400,
            rotation: '-40deg'
        });
        this.timeline.pause();
    }
    onWindowScroll(e) {
        let userTextTop = this.userDeviceTextWrapper.getBoundingClientRect().top;
        let documentTop = document.body.getBoundingClientRect().top;
        let percentageComplete = Utils.mapClamp(window.scrollY + this.blade.clientHeight - 100, userTextTop - documentTop, userTextTop - documentTop + 600, 0, 1);
        this.timeline.progress(percentageComplete);
    }
}

module.exports = GuillotineAnimation;

/*
* This files purpose is to return a mock of Gpio when not running in prod env
* (the pi-gpio package blows up on anything but a pi)
* */

const wpi = require('wiring-pi');

export default wpi;

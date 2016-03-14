/*
* This files purpose is to return a mock of Gpio when not running in prod env
* (the pi-gpio package blows up on anything but a pi)
* */
let Gpio = { // Mock Gpio object for non-prod environments

};

if(process.env['NODE_ENV'] === 'production') {
  console.log('including pi-gpio');
  Gpio = require('pi-gpio');
}

export default Gpio;
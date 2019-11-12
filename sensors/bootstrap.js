var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const Feedback = require('../ledBlinker');
const MQ6Analog = new Gpio(2, 'in');
const MQ6Digital = new Gpio(3, 'in');
const BEEP = new Gpio(4, 'out');
const LED = new Gpio(14, 'out');

var telemetrycall = null;
let elevated = false
exports.setTelemetry = (telemetry) => telemetrycall = telemetry;
var results = {
A : null,
B: null,
}
const readSensor = (object, name) => {
    object.read(function (err, val) {
        if (err) {
            throw err;
        }
      //  console.log('in callback')
    //    console.log(err)
//        console.log(`${name} : ${value}`);
	const value = val ^ 1;
	const oldVal = results[name]
	if(oldVal !== value) {
        results[name] = value;
const sms = require('../sms/sms');
        if(oldVal>0 && value <= 0) {
            // release elevated sms
//            sms.sendSms('', `LPG leak no longer a threat : ${ new Date().toTimeString()}`)
            sms.sendSms('+919581816991', `LPG leak no longer a threat : ${ new Date().toTimeString()}`)
        }
        if(value > 0) {
            // alert raised 
         //   sms.sendSms('', `LPG LEAK DETECTED : ${ new Date().toTimeString()}`)
		sms.sendSms('+919581816991', `LPG LEAK DETECTED : ${ new Date().toTimeString()}`)
        }
		 console.log(`${name} : ${value}`);
		BEEP.writeSync(value)
		LED.writeSync(value)
		telemetrycall && telemetrycall({gas: value, message: value>0 ? 'Danger' : 'Safe'})
		
	}
    });
}

const startSensor = () => {
    setInterval(() => {
    //    console.log('Reading')
     //   Feedback.genericLEDBlink(1, 50, 100)
        readSensor(MQ6Analog, 'A');
        readSensor(MQ6Digital, 'D');
    }, 100);
}

exports.startSensor = startSensor

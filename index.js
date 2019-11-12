var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

const GPIO_NUMS = [2, 3, 4, 5, 6, 7, 8, 9]

// function timeout(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }


const GPIO_OBJS = GPIO_NUMS.map(pin => new Gpio(pin, "high", "none", { activeLow: true }));


const SensorOffWrite = function (pin, index) {
    console.log(`set off ${GPIO_NUMS[index]}`);
    pin.writeSync(0)
}

const SensorOnWrite = function (pin, index) {
    console.log(`set on ${GPIO_NUMS[index]}`);
    pin.writeSync(1)
}

const releaseSensors = function (pin, index) {
    pin.unexport();
}

const start = () => {
    GPIO_OBJS.forEach((p, i) => {
        SensorOffWrite(p, i);
        setTimeout(function () {
            SensorOnWrite(p, i);
            setTimeout(() => {
                SensorOffWrite(p, i);
                setTimeout(() => (releaseSensors(p, i)), 1000);
            }, 7000)
        }, (1000+ i*1000))
    })
}

console.log('WAIT !')
let cursor = 0;
const sequence = () => {
    const PIN = GPIO_OBJS[cursor%GPIO_OBJS.length];
    const currVal = PIN.readSync()
    PIN.writeSync(1=currVal);
    cursor++;
}

const INTERV = setInterval(sequence, 2000);

setTimeout(() => {
    clearInterval(INTERV);
    start();
}, 30000)
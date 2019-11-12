var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(14, 'out'); //use GPIO pin 4, and specify that it is output
var BEEP = new Gpio(4, 'out');
// var blinkInterval = setInterval(blinkLED, 500); //run the blinkLED function every 250ms

const resetBlink = (object) => object.writeSync(0)

resetBlink(LED)
resetBlink(BEEP)

function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
    BEEP.writeSync(0)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
    BEEP.writeSync(1);
  }
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  BEEP.writeSync(0)
  LED.unexport(); // Unexport GPIO to free resources
}

doblink = (object, duration) => {
  object.writeSync(1)
  setTimeout(function () { object.writeSync(0) }, duration)
  // setTimeout(doblink(object, duration), )
}


// setTimeout(endBlink, 10000); //stop blinking after 5 seconds\
const genericLEDBlink = (count, blinkDuration, blinkInterval, countsync=0) => {
//  console.log(countsync)
  if (countsync == 0) { resetBlink(LED) }
  if (countsync === count) {
    return;
  } else {
    // if(countsync == 0) {doblink}
    //  setTimeout(doblink(LED, blinkDuration), blinkDuration);
    doblink(LED, blinkDuration)
    ++countsync;
    // setTimeout(genericLEDBlink(count, blinkDuration, blinkInterval), blinkInterval);
    setTimeout(function(){
      genericLEDBlink(count, blinkDuration, blinkInterval, countsync)
    }, blinkInterval)

  }
}
const genericBEEPBlink = (count, blinkDuration, blinkInterval, countsync=0) => {
  //var countsync = 0;
  // console.log(countsync)
  if (countsync == 0) { resetBlink(BEEP) }
  if (countsync === count) {
    return;
  } else {
    // if(countsync == 0) {doblink}
    //  setTimeout(doblink(LED, blinkDuration), blinkDuration);
    doblink(BEEP, blinkDuration)
    ++countsync;
    setTimeout(function(){
      genericBEEPBlink(count, blinkDuration, blinkInterval, countsync)
    }, blinkInterval)

  }
}


const startupblink = () => {
  // blink and beep once -> connected 
  genericLEDBlink(1, 1000, 2000);
  genericBEEPBlink(1,1000,2000);
  return;

}
exports.genericBEEPBlink = genericBEEPBlink;
exports.genericLEDBlink = genericLEDBlink;
exports.startupblink = startupblink;
'use strict';

const clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
const Message = require('azure-iot-device').Message;

const azureconfig = global.globalconfig.getConfigData('azure')
let client = null;
let i = 0;

const printResultFor = (op) => {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

const clientMessageHandler = (msg) => {
    client.complete(printResultFor('completed'))
    console.log(msg.data)
    if (msg.data[0] == 42) {
        console.log("\x1b[33m", 'Command = ' + msg.data);
        console.log("\x1b[0m", '------------------');
    } else {
        console.log("\x1b[31m", 'Command = ' + msg.data);
        console.log("\x1b[0m", '------------------');
    }
}

const connectCallBack = (err) => {
    err && console.log('CONNECTION TO HUB FAILED')
    /**
     * DO ERROR RETRIES ?? 
     */
    console.log('Client connected to IoT Hub');
    client.on('message', clientMessageHandler);

}

const dummyTelemetry = () => {
    messageTelemetry({numberofcycles: ++i})
    setInterval(() => {
        messageTelemetry({numberofcycles: ++i})
    }, 10000)
}

const keepaliveTelemetry = () => {
    messageTelemetry({numberofcycles: ++i})
    setInterval(() => {
        messageTelemetry({numberofcycles: ++i})
    }, 15 * 60 * 1000)
}

const dummyConnectCallBack = (err) => {
    err && console.log('CONNECTION TO HUB FAILED')
    /**
     * DO ERROR RETRIES ?? 
     */
    console.log('Client connected to IoT Hub');
    client.on('message', clientMessageHandler);
    dummyTelemetry()

}

const ConnectCallBack = (err) => {
    err && console.log('CONNECTION TO HUB FAILED')
    /**
     * DO ERROR RETRIES ?? 
     */
    console.log('Client connected to IoT Hub');
    client.on('message', clientMessageHandler);
    const sensors = require('../sensors/bootstrap');
    sensors.setTelemetry(messageTelemetry);
    keepaliveTelemetry()

}

// Exports
const messageTelemetry = (telemetry, callback) => {
    const message = new Message(JSON.stringify(telemetry))
    console.log("Telemetry sent: " + message.getData());
    client.sendEvent(message, callback ? callback() : printResultFor('send'));
}
// Exports
const AzureSetup = () => {
    const connStr = azureconfig['iotdeviceconnstringprimary']
    if (!connStr) {
        console.log('AZURE HUB CONNECTION NOT FOUND')
        return null;
    }

    client = clientFromConnectionString(connStr);
    console.log("\x1b[31m", 'NodeJs IoTHub DEMO');
    console.log("\x1b[0m", '==================');

    client.open(ConnectCallBack)


}

exports.config = {
    messageTelemetry,
    AzureSetup
}
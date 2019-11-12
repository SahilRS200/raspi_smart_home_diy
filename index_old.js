/**
 * A. create a config json
 * B. Load it up as global object
 */
const axios = require('axios');
const sha256 = require('sha256');
const GlobalUtils = require('./global');
const Sensors = require('./sensors/bootstrap')
const Global = GlobalUtils.Global;
const isMVP = GlobalUtils.isMVP()
// const devID = GlobalUtils.getDeviceID()
var devID = null
const Feedback = require('./ledBlinker');
const url = `http://sahilsnest.in/iot/${sha256(devID || '')}`

const processStartup = () => {
    // const sms = require('./sms/sms')
    // console.log(global.globalconfig.getConfigData('deviceid'))
    // sms.sendSms('', `Hello from ${global.globalconfig.getConfigData('deviceid')}`)
    Feedback.startupblink()
    console.log('feedback sent');
    const azureiothubconfig = require('./azure/iothub').config;
    azureiothubconfig.AzureSetup()
    Sensors.startSensor()
}

const getConfigFile = () => {
    console.log(url)
    axios.get(url)
        .then(resp => {
            const config = resp.data;

            global.globalconfig = new Global(config)
            processStartup()
        })
        .catch(e => {
            console.log(`${e['message']} | Time ${new Date().toISOString()}`)
            Feedback.genericBEEPBlink(3, 50, 500)
            if (isMVP) {
                console.log('NO REMOTE | BOOTING WITH ENVIRONMENT VARIABLES')
                global.globalconfig = new Global()
                processStartup()
            } else {
                console.log('NO MVP | INFINITE RETRIES ACTIVATED')
                setTimeout(getConfigFile, 5 * 60 * 1000)
            }
        })
}

GlobalUtils.getDeviceID()
    .then(data => { devID = data; console.log(devID); getConfigFile() })
    .catch(err => {
        devID = process.env['DEVICEID']
        if(devID && isMVP) {
            getConfigFile()
        }
        console.log('unable to bootstrap ')
        Feedback.genericBEEPBlink(6, 10, 500)
        Feedback.genericLEDBlink(10, 100, 1000)
    })
// getConfigFile();

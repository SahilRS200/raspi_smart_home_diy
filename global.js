'use strict'

const data = {
    deviceid: process.env['DEVICEID'],
    aws: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
        region: process.env['AWS_REGION'],
    },
    azure: {
        iotdeviceconnstringprimary: process.env['AZURE_DEVICE_CONN_STRING_PRIMARY']
    },
    gcp: {

    },
    mongo: {
        user: process.env['MONGO_USER'],
        pw: process.env['MONGO_PW'],
        url: process.env['MONGO_URL'],
        db: process.env['MONGO_DB'],
        retry: process.env['MONGO_RETRIES'],
    }
}


class Global {
    constructor(remoteConfig) {
        let rcfg = typeof remoteConfig === 'string' ? JSON.parse(remoteConfig) : remoteConfig;
        let configdata = rcfg || { ...data };
        console.log(configdata)
        return {
            getConfigData: function (key) {
                const result = configdata[key]
                if(typeof result === typeof 'string'){return result}
                return {...result}
            },
            createOrUpdateConfigData: function (key, value) {
                const oldData = configdata[key];
                if (oldData && (typeof oldData).toLowerCase() === 'object') {
                    configdata[key] = {
                        ...oldData,
                        ...value
                    }
                }
                else {
                    configdata[key] = value;
                }
            }
        }
    }
}

// const GlobalConfig = new Global();
exports.getDeviceID = () => new Promise(function(resolve, reject){
    const raspiInfo = require('./raspberryinfo')
    raspiInfo.getSerial(function(err, val) {
        if(err) {
            reject(err)
        }
        const ret = val || process.env['DEVICEID']
        resolve(ret)
    })
})

exports.isMVP = () => {
    return process.env['DEVICEID'] && process.env['AWS_ACCESS_KEY_ID'] && process.env['MONGO_USER'];
}
exports.Global=Global;
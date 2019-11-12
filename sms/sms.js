'use strict';
// var config = require('./snsConfig.json');
const aws = global.globalconfig.getConfigData('aws')
const errorsmsconfig=global.globalconfig.getConfigData('errorsmsconfig')
console.log('in sms')
console.log(aws)
var config = {
    awsconfig: aws,
    paramconfig : {
        attributes : {
          DefaultSMSType: "Transactional"
        }
    },
    errorsmsconfig: errorsmsconfig
}

console.log(config)

var AWS = require('aws-sdk');
var phone = require('phone');
AWS.config.update(config.awsconfig);

const configureSMS = function() {
    var setSMSType = new AWS.SNS({apiVersion: '2010-03-31'}).setSMSAttributes(config.paramconfig).promise();
    return setSMSType;
}

const sendSms = function(number,message) {
    var phnumber = phone(number.toString())[0];
    var params={};
    if(phnumber){
        params.PhoneNumber=phnumber.toString();
        params.Message=message.toString();
        return new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
    }
    else {
        throw 'number malformed';
    }
}

exports.sendErrorSMS= function() {
    var numbers = config.errorsmsconfig.numbers;
    var message = `${config.errorsmsconfig.message} \n Email : ${global.configStatus.isEmail ? 'Started' : 'Failed'} \n Mongo : ${global.configStatus.mongo ? 'Started' : 'Failed'} \n Security : ${global.configStatus.isSecu ? 'Started' : 'Failed'} `;
    numbers.map(e => sendSms(e,message));
    return;
}
exports.doSetup = function() {
    console.log(`in Sms ${configStatus.isSecu}`);
    console.log("\nCalling AWS to setup SMS service");
    return configureSMS();
}
exports.sendSms = sendSms;
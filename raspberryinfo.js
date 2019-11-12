const exec = require('child_process').exec;

exports.getSerial = (callback) => {
    try {
        exec('cat /proc/cpuinfo | grep Serial', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);// this is your RPI serial number
            console.log(`stderr: ${stderr}`);
            callback(stderr, stdout)
        });
    } catch (e) {
        callback(e , null)
    }
}
const {config} = require('./wdio.conf');
const AndroidInfo = require('./android.info');
const path = require('path');

// Appium capabilities
config.capabilities = [
    {
        platformName: 'Android',
        'appium:noReset': true,
        'appium:fullReset': false,
        maxInstances: 1,
        'appium:automationName': 'uiautomator2',
        'appium:deviceName': AndroidInfo.deviceName(),
        'appium:platformVersion': AndroidInfo.platFormVersion(),
        'appium:app': path.resolve(`./apps/${AndroidInfo.appName()}`)
    }
];

config.cucumberOpts.tagExpression = '@androidApp'; // pass tag to run tests specific to android

exports.config = config;
const {config} = require('./wdio.conf');
const AndroidInfo = require('./android.info');

// Appium capabilities
config.capabilities = [
    {
        platformName: 'Android',
        browserName: 'chrome',
        maxInstances: 1,
        'appium:automationName': 'uiautomator2',
        'appium:deviceName': AndroidInfo.deviceName(),
        'appium:platformVersion': AndroidInfo.platFormVersion(),
        'appium:chromedriverAutodownload': true
    }
];

config.cucumberOpts.tagExpression = '@androidBrowser'; // pass tag to run tests specific to android

exports.config = config;




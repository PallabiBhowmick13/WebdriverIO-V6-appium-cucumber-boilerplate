class AndroidInfo {
    static deviceName() {
        return 'emulator-5554'; // pass the udid or devicename of nexus 5
    }

    static platFormVersion() {
        return '8.0.0'; // pass the platform version (Android version) of nexus 5
    }

    static appName() {
        return 'Celsius Fahrenheit Converter_v1.0.1_apkpure.com.apk'; // pass the apk name
    }
}

module.exports = AndroidInfo;

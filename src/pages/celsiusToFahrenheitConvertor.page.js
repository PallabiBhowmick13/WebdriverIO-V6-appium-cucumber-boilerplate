const ActionHelper = require('./../helpers/actionHelpers');
require('chai').should();

class CelsiusToFahrenhietConvertorPage {

    getObjectLocator() {
        const platform = browser.capabilities.platformName.toLowerCase();
        return require(`./../screens/native/${platform}/celsiusToFahrenheitConvertor.screen.js`);
    }

    dismissAppRatingIfPresent() {
        if (ActionHelper.isVisible(this.getObjectLocator().rateAppMessage)) {
            ActionHelper.click(this.getObjectLocator().laterButton);
        }
    }

    launchApp() {
        ActionHelper.launchApp();
        ActionHelper.switchToNativeContext();
        ActionHelper.pause(10);
    }

    verifyCelsiusFieldDisplayed() {
        this.dismissAppRatingIfPresent();
        ActionHelper.waitForElement(this.getObjectLocator().celsiusTextField, 4);
        ActionHelper.isVisible(this.getObjectLocator().celsiusTextField).should.equal(true);
    }

    clearCelsiusField() {
        ActionHelper.waitForElement(this.getObjectLocator().celsiusTextField, 4);
        ActionHelper.clearText(this.getObjectLocator().celsiusTextField);
    }

    enterCelsius(celsiusValue) {
        this.dismissAppRatingIfPresent();
        ActionHelper.waitForElement(this.getObjectLocator().celsiusTextField, 4);
        ActionHelper.clearText(this.getObjectLocator().celsiusTextField);
        ActionHelper.sendText(this.getObjectLocator().celsiusTextField, celsiusValue);
        ActionHelper.click(this.getObjectLocator().submitButton);
    }

    verifyFahrenheitValue(fahrenheitValue) {
        ActionHelper.waitForElement(this.getObjectLocator().fahrenheitTextField, 4);
        const actualText = ActionHelper.getText(this.getObjectLocator().fahrenheitTextField);
        parseFloat(actualText).should.equal(parseFloat(fahrenheitValue));
    }
   
}

module.exports = CelsiusToFahrenhietConvertorPage;

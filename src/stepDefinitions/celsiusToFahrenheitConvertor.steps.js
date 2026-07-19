const {Given, When, Then} = require('cucumber');

const CelsiusToFahrenheitConvertorPage = require('./../pages/celsiusToFahrenheitConvertor.page');

const celsiusToFahrenheitConvertorPage = new CelsiusToFahrenheitConvertorPage();

Given(/^I launch the app$/, () => {
    celsiusToFahrenheitConvertorPage.launchApp();
});

Then(/^I should see the celsius input field displayed$/, () => {
    celsiusToFahrenheitConvertorPage.verifyCelsiusFieldDisplayed();
});

When(/^I enter celsius of (.*)$/, (celsius) => {
    celsiusToFahrenheitConvertorPage.enterCelsius(celsius);
});

When(/^I clear the celsius field$/, () => {
    celsiusToFahrenheitConvertorPage.clearCelsiusField();
});

Then(/^I should see fahrenheit of (.*)$/, (fahrenheit) => {
    celsiusToFahrenheitConvertorPage.verifyFahrenheitValue(fahrenheit);
});

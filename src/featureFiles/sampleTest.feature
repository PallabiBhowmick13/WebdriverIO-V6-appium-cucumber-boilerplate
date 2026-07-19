Feature: Sample feature file to illustrate app and browser tests

  @androidApp
  Scenario: Convert multiple celsius values to fahrenheit correctly
    Given I launch the app
    Then I should see the celsius input field displayed
    When I enter celsius of 0
    Then I should see fahrenheit of 32
    When I clear the celsius field
    And I enter celsius of 100
    Then I should see fahrenheit of 212
    When I clear the celsius field
    And I enter celsius of -40
    Then I should see fahrenheit of -40

  @iosApp
  Scenario: Launch Settings app of an iphone
    Given I launch the settings app of iphone
    Then I should see the general label

  @androidBrowser @iosBrowser
  Scenario: Launch the google url in browser
    Given I launch the google
    Then I verify the title to be Google

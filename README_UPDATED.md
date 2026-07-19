# WebdriverIO V6 + Appium + Cucumber — Mobile Automation Tech Test

This project extends the [WebdriverIO-V6-appium-cucumber-boilerplate](https://github.com/Arjun-Ar91/WebdriverIO-V6-appium-cucumber-boilerplate.git)
with a 10-step BDD scenario automating a native Android app, run end-to-end
against an emulator via Appium, with an HTML Cucumber report.


## Based on

- WebdriverIO v6
- Cucumber v6
- Node.js v14.21.3
- Appium 3.5.2 (uiautomator2 driver)

## What's included

| Script | Status | Notes |
|---|---|---|
| `npm run android` | Working | Native Android app, 10-step scenario, passing |
| `npm run androidBrowser` | Attempted, not passing | See detailed writeup below |
| `npm run lint` | Working | ESLint, no emulator/Appium required |
| `npm run ios` / `npm run iosBrowser` | Not run | Requires macOS + Xcode; not possible on this Windows machine |

## Native Android test (`npm run android`)

- **App under test:** the bundled Celsius to Fahrenheit Converter native Android app (`apps/`)
- **Scenario:** `src/featureFiles/sampleTest.feature` — a 10-step scenario that
  launches the app, verifies the input field is displayed, and runs three
  Celsius-to-Fahrenheit conversions (0C, 100C, -40C), clearing the field
  and re-asserting the converted value each time
- **Step definitions:** `src/stepDefinitions/celsiusToFahrenheitConvertor.steps.js`
- **Page object:** `src/pages/celsiusToFahrenheitConvertor.page.js`
- **Screen locators:** `src/screens/native/android/celsiusToFahrenheitConvertor.screen.js`
- **Report:** generated at `reports/html/index.html` after each run

### Running it locally

1. Install Node.js **14.21.3** (see Environment notes for why this specific version is required).
2. Install Appium and the uiautomator2 driver:
   ```
   npm install -g appium
   appium driver install uiautomator2
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Boot an Android emulator. This project was run against:
   - **Device:** Nexus 5
   - **Android version:** 8.0 ("Oreo")
   - **ABI:** x86
   - **API level:** 26

   (see notes below on why an older image was needed).
5. Update `config/android.info.js` with your emulator's device ID (from `adb devices`) and Android version.
6. In one terminal, start Appium:
   ```
   appium
   ```
7. In another terminal, run the test:
   ```
   npm run android
   ```
8. Open `reports/html/index.html` to view the Cucumber HTML report.

## `androidBrowser` — what was tried, and why it currently fails

The brief's mobile track only requires a native or hybrid app, so this is not
a blocker for the core deliverable — it was attempted as an extra
demonstration of the boilerplate's mobile-browser capability, using the
existing `@androidBrowser` scenario (launch Chrome inside the emulator,
navigate to Google, verify the page title).

**Issue 1 — missing W3C capability prefix.**
`config/androidBrowser.config.js` sent capabilities the pre-W3C way
(`deviceName`, `platformVersion`, `automationName` with no prefix). Modern
Appium 3.x enforces the W3C WebDriver spec, which rejects unprefixed
capabilities with a 400 error. **Fixed** by adding the `appium:` vendor
prefix to each, the same fix applied to the native Android config.

**Issue 2 — chromedriver version mismatch.**
Once the session request was correctly formed, Appium reported:
`No Chromedriver found that can automate Chrome '58.0.3029'`. The Nexus 5 /
Android 8.0 emulator image ships with a Chrome build from 2017, and Appium's
bundled chromedriver binaries don't go back that far. **Attempted fix:**
added `'appium:chromedriverAutodownload': true` to the capabilities, and
restarted Appium with `--allow-insecure uiautomator2:chromedriver_autodownload`
(this insecure feature is disabled by default in Appium 3.x and must be
explicitly allowed per-driver).

**Issue 3 — invalid `/status` response (current blocker).**
With autodownload enabled, session creation now fails with:
`The response to the /status API is not valid: {"build":{"version":"alpha"},"os":{...}}`.
This response shape matches chromedriver's own default status payload, not a
valid Appium/W3C new-session response — suggesting a compatibility gap
between Appium 3.5.2's `chromedriver_autodownload` handling and this specific
combination of an old, no-longer-serviced Chrome version and the newest
Appium release. This was reproduced consistently across multiple clean
restarts of both Appium and the emulator, ruling out a stale-process or
leftover-port issue.

**Conclusion:** rather than continue sinking time into a mismatch between a
2017-era bundled browser and 2026-era Appium tooling — for a scenario outside
the assignment's core requirement — this was documented and set aside.
A follow-up option, not yet attempted, would be running this scenario against
a newer emulator image (Android 11+) with an up-to-date, evergreen Chrome
build, which should avoid the version-compatibility gap entirely.

## `npm run lint`

Runs ESLint over the project's JavaScript to check code style and catch
common mistakes (inconsistent indentation, unused variables, risky patterns
like `==` instead of `===`, etc). It doesn't execute any tests or require
Appium/an emulator — it's static analysis only, and can be run at any time
from the project root:

```
npm run lint
```

**Status: passing, no errors.** One indentation issue (introduced while
editing `verifyFahrenheitValue` in `celsiusToFahrenheitConvertor.page.js` to
compare Fahrenheit values numerically — see Environment notes) was caught
by this check and corrected to match the project's existing style. A clean
`eslint .` run prints nothing and exits with no error, which is what this
project currently does.

## Troubleshooting: Appium port conflicts / stale sessions

During repeated test runs across a long working session, Appium can end up
in a state where port 4723 is occupied by a stale or crashed process rather
than a live server — session requests then fail immediately (404s, invalid
`/status` responses, or "port already in use" errors) even though the test
code itself is correct. If `npm run android` (or `androidBrowser`) suddenly
fails after previously working with no code changes, this is almost always
the cause. Recovery steps:

1. **Restart Appium fresh.** In your Appium terminal:
   ```
   nvm use 24.11.1
   appium
   ```
   Wait for the full successful startup log, the same one you'd see on a
   clean run (driver loaded, REST listener started on port 4723) before
   doing anything else.

   If the terminal reports the port is still in use, first free it:
   ```
   netstat -ano | findstr :4723
   taskkill /PID <the PID from that output> /F
   ```
   then run `appium` again.

2. **Rerun the test.** Confirm the emulator (Nexus 5 / Android 8.0) is still
   booted:
   ```
   adb devices
   ```
   Then, in your project terminal:
   ```
   nvm use 14.21.3
   npm run android
   ```

Appium (Node 24.11.1) and the project's test runner (Node 14.21.3)
deliberately run under different Node versions in separate terminals — see
[Environment notes](#environment-notes) — so always re-run `nvm use` in
whichever terminal you're working in after opening it fresh, since each new
terminal window starts back on the system default Node version.

## Environment notes

This boilerplate was originally built in 2020 and required several
compatibility fixes to run on a modern (2026) Windows machine with current
Appium/Android tooling:

- **Node.js version:** the `fibers` package (used by this older WebdriverIO/
  Cucumber sync execution model) only supports Node.js up to ~v16, so Node
  14.21.3 is used via `nvm-windows` rather than the system's current Node
  version. Appium itself runs separately under a newer Node version
  (24.11.1), since it has no such constraint.
- **Build tools:** compiling `fibers` requires Visual Studio Build Tools
  ("Desktop development with C++"), a `node-gyp` version new enough to
  detect that Visual Studio install, and Python 3.11 (Python 3.12+ removed
  the `distutils` module that older `node-gyp`/`gyp` depends on).
- **Appium capabilities:** modern Appium (3.x) enforces the W3C WebDriver
  spec, which requires non-standard capabilities to use the `appium:`
  vendor prefix (e.g. `appium:deviceName` instead of `deviceName`) —
  updated in both `config/android.config.js` and `config/androidBrowser.config.js`.
- **App launch:** modern Appium removed the legacy `driver.launchApp()`
  command; since the `app` capability already triggers an automatic launch
  on session start, `ActionHelper.launchApp()` was updated to a no-op.
- **Emulator Android version:** the bundled native test APK targets an old
  SDK version and is rejected by modern Android emulator images
  (`INSTALL_FAILED_DEPRECATED_SDK_VERSION`), so an older emulator image was
  used to run it — **Nexus 5, Android 8.0 ("Oreo"), x86, API level 26** —
  this is also the emulator whose old bundled Chrome caused the
  `androidBrowser` issue above.
- **Assertion format:** the app returns fahrenheit values with a trailing
  `.0` (e.g. `32.0`), so the assertion in `verifyFahrenheitValue` compares
  numerically (`parseFloat`) rather than as an exact string match.
- **Appium driver install:** a corrupted nested dependency
  (`@appium/logger`) inside `appium-uiautomator2-driver`'s own
  `node_modules` initially prevented the driver from loading; resolved by
  reinstalling Appium under a Node version new enough for its own
  dependency tree to resolve cleanly.




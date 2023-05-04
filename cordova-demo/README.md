### Running this example

For installing the TangemSdk plugin - open the terminal with destination folder of "cordova-demo" project and execute cli commands:

Add the `tangem-sdk` plugin to the project
```bash
cordova plugin add tangem-sdk
```

Add a platform to the project
```bash
cordova platform add android|ios
```

Run it!
```bash
cordova run android|ios
```

To run the demo app locally, first copy the demo project out of the plugin directory. Then `cd` into the demo directory and execute:

```bash
cordova plugin add  ../tangem-sdk-cordova/
cordova platform add ios
cd platforms/ios
pod install
```

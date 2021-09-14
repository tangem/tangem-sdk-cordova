
[![npm](https://img.shields.io/npm/v/tangem-sdk.svg?style=flat)](https://www.npmjs.com/package/tangem-sdk)

The Tangem card is a self-custodial hardware wallet for blockchain assets. The main functions of Tangem cards are to securely create and store a private key from a blockchain wallet and sign blockchain transactions. The Tangem card does not allow users to import/export, backup/restore private keys, thereby guaranteeing that the wallet is unique and unclonable.

- [Getting Started](#getting-started)
	- [Requirements](#requirements)
	- [Installation](#installation)
		- [Cordova](#cocoapods)
        - [Capacitor](#capacitor)
        - [iOS Notes](#ios-notes)
        - [Android Notes](#android-notes)
- [Usage](#usage)
	- [Scan card](#scan-card)
	- [Sign](#sign)
    - [Wallet](#wallet)
        - [Create Wallet](#create-wallet)
        - [Purge Wallet](#purge-wallet)
    - [PIN codes](#pin-codes)    

## Getting Started

### Requirements
#### iOS
iOS 11+ (CoreNFC is required), Xcode 11+
SDK can be imported to iOS 11, but it will work only since iOS 13.

#### Android
Android with minimal SDK version of 21 and a device with NFC support

### Installation
#### Cordova

```cordova plugin add tangem-sdk```

##### IOS Notes
Your config.xml must contain.
```xml
    <platform name="ios">
        ...
        <preference name="deployment-target" value="13.0" />
        <preference name="SwiftVersion" value="5.0" />
    </platform>
```

#### Capacitor

```npm install tangem-sdk```

```npx cap sync```


Cordova platform should do all the configurations by itself, but if you install this plugin from other compatible platforms do the following steps.
##### iOS notes

1) Configure your app to detect NFC tags. Turn on Near Field Communication Tag Reading under the Capabilities tab for the project’s target (see [Add a capability to a target](https://help.apple.com/xcode/mac/current/#/dev88ff319e7)).

2) Add the [NFCReaderUsageDescription](https://developer.apple.com/documentation/bundleresources/information_property_list/nfcreaderusagedescription) key as a string item to the Info.plist file. For the value, enter a string that describes the reason the app needs access to the device’s NFC reader: 
```xml
<key>NFCReaderUsageDescription</key>
<string>Some reason</string>
```

3) In the Info.plist file, add the list of the application identifiers supported in your app to the [ISO7816 Select Identifiers](https://developer.apple.com/documentation/bundleresources/information_property_list/select-identifiers) (AIDs) information property list key. The AIDs of Tangem cards are: `A000000812010208` and `D2760000850101`.

```xml
<key>com.apple.developer.nfc.readersession.iso7816.select-identifiers</key>
    <array>
        <string>A000000812010208</string>
        <string>D2760000850101</string>
    </array>
```

4) To prevent customers from installing apps on a device that does not support the NFC capability, add the following to the Info.plist code:

```xml
<key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>nfc</string>
    </array>
```

##### Android notes
1) Save the file tech_filter.xml (you can name it anything you wish) with the following tech-list filters in the `<project-root>/res/xml`

```xml
<resources>
   <tech-list>
       <tech>android.nfc.tech.IsoDep</tech>
       <tech>android.nfc.tech.Ndef</tech>
       <tech>android.nfc.tech.NfcV</tech>
   </tech-list>
</resources>
```

2) Add to `AndroidManifest.xml`:
```xml
<activity android:name="MainActivity" android:theme="@style/Theme.AppCompat.Light.DarkActionBar" />

<intent-filter>
    <action android:name="android.nfc.action.TECH_DISCOVERED" />
</intent-filter>
<meta-data
    android:name="android.nfc.action.TECH_DISCOVERED"
    android:resource="@xml/tech_filter" />
```

### Usage
Tangem SDK is a self-sufficient solution that implements a card abstraction model, methods of interaction with the card and interactions with the user via UI.

The easiest way to use the SDK is to call basic methods. The basic method performs one or more operations and, after that, calls completion block with success or error.

Most of functions have the optional `cardId` argument, if it's passed the operation, it can be performed only with the card with the same card ID. If card is wrong, user will be asked to take the right card.
We recommend to set this argument if there is no special need to use any card.

When calling basic methods, there is no need to show the error to the user, since it will be displayed on the NFC popup before it's hidden.

#### Scan card
Method `tangemSdk.scanCard()` is needed to obtain information from the Tangem card. Optionally, if the card contains a wallet (private and public key pair), it proves that the wallet owns a private key that corresponds to a public one.

**Arguments:**

| Parameter | Description |
| ------------ | ------------ |
| initialMessage | *(Optional)* A custom description that shows at the beginning of the NFC session. If nil, default message will be used |
| callback | *(Optional)* A callback function with 2 arguments: `result` and `error` |

```js
var initialMessage = { body: 'Body', header: 'Header' }; 
function callback(result, error) {
  console.log(error ? 'error: ' + JSON.stringify(error): 'result: ' + JSON.stringify(result));
}

TangemSdk.scanCard(initialMessage, callback);
```

#### Sign
Method `tangemSdk.sign()` allows you to sign one or multiple hashes. The SIGN command will return a corresponding array of signatures.

**Arguments:**

| Parameter | Description |
| ------------ | ------------ |
| hashes | Array of hashes to be signed by card |
| walletPublicKey | Public key of wallet that should be purged. |
| hdPath | Public Derivation path of the wallet. Optional. COS v. 4.28 and higher |
| cardId | *(Optional)* If cardId is passed, the sign command will be performed only if the card  |
| initialMessage | *(Optional)* A custom description that shows at the beginning of the NFC session. If nil, default message will be used |
| callback | *(Optional)* A callback function with 2 arguments: `result` and `error` |


```js
var hashes = [
  '44617461207573656420666f722068617368696e67',
  '4461746120666f7220757365642068617368696e67'
];
var walletPublicKey = '04C1E394BF9873331E296268290F79FF96DE3F97703C96AA7B2A7037AF6AB4FE0FB35E3DAD8FD4374C227A793105ED6617F289B0314B105CDDE20BF1F2A692E42B';
var cardId = 'CB41000000004271';
var initialMessage = { body: 'Body', header: 'Header' };
function callback(result, error) {
	console.log(error ? 'error: ' + JSON.stringify(error): 'result: ' + JSON.stringify(result));
}

TangemSdk.sign(hashes, walletPublicKey, cardId, initialMessage, callback);
```

#### Wallet
##### Create Wallet
Method `tangemSdk.createWallet()` will create a new wallet on the card. A key pair `WalletPublicKey` / `WalletPrivateKey` is generated and securely stored in the card.

**Arguments:**

| Parameter | Description |
| ------------ | ------------ |
| curve | Wallet's elliptic curve |
| isPermanent | If this wallet can be deleted or not. |
| cardId | If cardId is passed, the sign command will be performed only if the card  |
| initialMessage | *(Optional)* A custom description that shows at the beginning of the NFC session. If nil, default message will be used |
| callback | *(Optional)* A callback function with 2 arguments: `result` and `error` |

```js
var congig = {isReusable: true, prohibitPurgeWallet: true, EllipticCurve: 'secp256k1'};
var cardId = 'CB41000000004271';
var initialMessage = { body: 'Body', header: 'Header' };
function callback(result, error) {
  console.log(error ? 'error: ' + JSON.stringify(error): 'result: ' + JSON.stringify(result));
}

TangemSdk.createWallet(config, cardId, initialMessage, callback);
```

##### Purge Wallet
Method `tangemSdk.purgeWallet()` delete wallet data.

**Arguments:**

| Parameter | Description |
| ------------ | ------------ |
| walletPublicKey | Public key of wallet that should sign hashes. |
| cardId | If cardId is passed, the sign command will be performed only if the card  |
| initialMessage | *(Optional)* A custom description that shows at the beginning of the NFC session. If nil, default message will be used |
| callback | *(Optional)* A callback function with 2 arguments: `result` and `error` |


```js
var walletPublicKey = '04C1E394BF9873331E296268290F79FF96DE3F97703C96AA7B2A7037AF6AB4FE0FB35E3DAD8FD4374C227A793105ED6617F289B0314B105CDDE20BF1F2A692E42B';
var cardId = 'CB41000000004271';
var initialMessage = { body: 'Body', header: 'Header' };
function callback(result, error) {
	console.log(error ? 'error: ' + JSON.stringify(error): 'result: ' + JSON.stringify(result));
}

TangemSdk.purgeWallet (walletPublicKey, cardId, initialMessage, callback);
```

#### Pin codes
*Access code* restricts access to the whole card. App must submit the correct value of Access code in each command. 
*Passcode* is required to sign a transaction or to perform some other commands entailing a change of the card state.

**Arguments:**

| Parameter | Description |
| ------------ | ------------ |
| code | Pin data |
| cardId | *(Optional)* If cardId is passed, the sign command will be performed only if the card  |
| initialMessage | *(Optional)* A custom description that shows at the beginning of the NFC session. If nil, default message will be used |
| callback | *(Optional)* A callback function with 2 arguments: `result` and `error` |

```js
TangemSdk.setAccessCode(code, cardId, initialMessage, callback);
TangemSdk.setPassCode(code, cardId, initialMessage, callback);
```
### Card attestation
#### Card verification
This command is a part of Tangem card attestation. In manufacturing, every new Tangem card internally generates a Card Key pair Card Public Key / Card Private Key. The private key is permanently stored in the card memory and is not accessible to external applications via the NFC interface. At the same time, Tangem publishes the list of CID and corresponding Card Public Key values in its card attestation service and/or hands over this list to the Card Issuer.

**Arguments:**

| Parameter | Description |
| ------------ | ------------ |
| online | Flag that allows disable online verification. Do not use for developer cards
| cardId | *(Optional)* If cardId is passed, the sign command will be performed only if the card  |
| initialMessage | *(Optional)* A custom description that shows at the beginning of the NFC session. If nil, default message will be used |
| callback | *(Optional)* A callback function with 2 arguments: `result` and `error` |
```js
TangemSdk.verify(pin, cardId, initialMessage, callback);
```

var exec = require('cordova/exec');

var name = "TangemSdkPlugin"

var callback = {
    success: function(result) {},
    error: function(error) {}
}

var PluginInterface = {

    scanCard: function(callback, optional) {
        var valuesToExport = createExportingValues(optional);
        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'scanCard', [valuesToExport]);
    },

    sign: function(callback, cid, hashes, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        valuesToExport.hashes = hashes;

        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'sign', [valuesToExport]);
    },

    verify: function(callback, cid, online, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        valuesToExport.online = online;

        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'verify', [valuesToExport]);
    },

    readIssuerData: function (callback, cid, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'readIssuerData', [valuesToExport]);
    },

    writeIssuerData: function (callback, cid, issuerData, issuerDataSignature, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        valuesToExport.issuerData = issuerData;
        valuesToExport.issuerDataSignature = issuerDataSignature;
        valuesToExport.issuerDataCounter = optional.issuerDataCounter;

        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'writeIssuerData', [valuesToExport]);
    },

    readIssuerExtraData: function (callback, cid, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'readIssuerExtraData', [valuesToExport]);
    },

    writeIssuerExtraData: function (callback, cid, issuerData, startingSignature, finalizingSignature, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        valuesToExport.issuerData = issuerData;
        valuesToExport.startingSignature = startingSignature;
        valuesToExport.finalizingSignature = finalizingSignature;
        valuesToExport.issuerDataCounter = optional.issuerDataCounter;

        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'writeIssuerExtraData', [valuesToExport]);
    },

    readUserData: function (callback, cid, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        exec(
             function (result) { callback.success(JSON.parse(result)); },
             function (error) { callback.error(JSON.parse(error)); },
             name, 'readUserData', [valuesToExport]);
    },

    writeUserData: function (callback, cid, userData, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        valuesToExport.userData = userData;
        valuesToExport.userCounter = optional.userCounter;

        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'writeUserData', [valuesToExport]);
       },

    writeUserProtectedData: function (callback, cid, userProtectedData, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        valuesToExport.userProtectedData = userProtectedData;
        valuesToExport.userProtectedCounter = optional.userProtectedCounter;

        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'writeUserProtectedData', [valuesToExport]);
    },

    createWallet: function (callback, cid, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'createWallet', [valuesToExport]);
    },

    purgeWallet: function (callback, cid, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'purgeWallet', [valuesToExport]);
    },

    changePin1: function (callback, cid, pinCode, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        valuesToExport.pinCode = pinCode
        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'changePin1', [valuesToExport]);
    },

    changePin2: function (callback, cid, pinCode, optional) {
        var valuesToExport = createExportingValues(optional, cid)
        valuesToExport.pinCode = pinCode
        exec(
            function (result) { callback.success(JSON.parse(result)); },
            function (error) { callback.error(JSON.parse(error)); },
            name, 'changePin2', [valuesToExport]);
    }
}

function createExportingValues(optional, optionalCid) {
    var valuesToExport = {};
    if (optionalCid != null) valuesToExport.cid = optionalCid;
    if (optional == null) return valuesToExport;

    valuesToExport.initialMessage = optional.initialMessage;
    return valuesToExport;
}

module.exports = PluginInterface;

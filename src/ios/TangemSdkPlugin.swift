import TangemSdk

@objc(TangemSdkPlugin) class TangemSdkPlugin: CDVPlugin {
    
    private var sdk: TangemSdk!
    
    override func pluginInitialize() {
        sdk = TangemSdk()
    }
    
    @objc(scanCard:) func scanCard(command: CDVInvokedUrlCommand) {
        sdk.scanCard(initialMessage: command.params?.initialMessage) {[weak self] result in
            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(sign:) func sign(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let hashes = params?.stringArray("hashes")?.compactMap({Data(hexString: $0)}),
            let cid = params?.cid else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }
        
        sdk.sign(hashes: hashes, cardId: cid, initialMessage: params?.initialMessage) {[weak self] result in
            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(readIssuerData:) func readIssuerData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cid = params?.cid else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }
        
        sdk.readIssuerData(cardId: cid, initialMessage: params?.initialMessage) {[weak self] result in
            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(writeIssuerData:) func writeIssuerData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cid = params?.cid,
            let issuerData = params?.data("issuerData"),
            let issuerDataSignature = params?.data("issuerDataSignature")  else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }
        
        let issuerDataCounter = params?.int("issuerDataCounter")
        sdk.writeIssuerData(cardId: cid,
                            issuerData: issuerData,
                            issuerDataSignature: issuerDataSignature,
                            issuerDataCounter: issuerDataCounter,
                            initialMessage: params?.initialMessage) {[weak self] result in
                                self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(readIssuerExtraData:) func readIssuerExtraData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cid = params?.cid else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }
        
        sdk.readIssuerExtraData(cardId: cid, initialMessage: params?.initialMessage) {[weak self] result in
            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(writeIssuerExtraData:) func writeIssuerExtraData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cid = params?.cid,
            let issuerData = params?.data("issuerData"),
            let startingSignature = params?.data("startingSignature"),
            let finalizingSignature = params?.data("finalizingSignature") else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }
        
        let issuerDataCounter = params?.int("issuerDataCounter")
        sdk.writeIssuerExtraData(cardId: cid,
                                 issuerData: issuerData,
                                 startingSignature: startingSignature,
                                 finalizingSignature: finalizingSignature,
                                 issuerDataCounter: issuerDataCounter,
                                 initialMessage: params?.initialMessage) {[weak self] result in
                                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(readUserData:) func readUserData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cid = params?.cid else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }
        
        sdk.readUserData(cardId: cid, initialMessage: params?.initialMessage) {[weak self] result in
            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(writeUserData:) func writeUserData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cid = params?.cid,
            let userData = params?.data("userData") else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }
        
        let userCounter = params?.int("userCounter")
        sdk.writeUserData(cardId: cid,
                          userData: userData,
                          userCounter: userCounter,
                          initialMessage: params?.initialMessage) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(writeUserProtectedData:) func writeUserProtectedData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cid = params?.cid,
            let userProtectedData = params?.data("userProtectedData") else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }
        
        let userProtectedCounter = params?.int("userProtectedCounter")
        sdk.writeUserProtectedData(cardId: cid,
                                   userProtectedData: userProtectedData,
                                   userProtectedCounter: userProtectedCounter,
                                   initialMessage: params?.initialMessage) {[weak self] result in
                                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(createWallet:) func createWallet(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cid = params?.cid else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }
        
        sdk.createWallet(cardId: cid, initialMessage: params?.initialMessage) {[weak self] result in
            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(purgeWallet:) func purgeWallet(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cid = params?.cid else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }
        
        sdk.purgeWallet(cardId: cid, initialMessage: params?.initialMessage) {[weak self] result in
            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    private func handleMissingArgs(callbackId: String) {
        let errorResult = CDVPluginResult(status: .error, messageAs:
        """
        {
          "code" : "9999",
          "localizedDescription" : "Some arguments are missing or wrong"
        }
        """
        )
        commandDelegate.send(errorResult, callbackId: callbackId)
    }
    
    private func handleResult<TResult: TlvCodable>(_ result: Result<TResult, SessionError>, callbackId: String) {
        var cdvresult: CDVPluginResult
        switch result {
        case .success(let response):
            cdvresult = CDVPluginResult(status: .ok, messageAs: response.description)
        case .failure(let error):
            cdvresult = CDVPluginResult(status: .error, messageAs: "\(error.jsonDescription)")
        }
        commandDelegate.send(cdvresult, callbackId: callbackId)
    }
}

fileprivate extension CDVInvokedUrlCommand {
    var params: [String: Any]? {
        arguments.first as? [String: Any]
    }
}

fileprivate extension Dictionary where Key == String, Value == Any {
    var initialMessage: String? {
        return string("initialMessage")
    }
    
    var cid: String? {
        return string("cid")
    }
    
    func string(_ forKey: String) -> String? {
        return self[forKey] as? String
    }
    
    func stringArray(_ forKey: String) -> [String]? {
        return self[forKey] as? [String]
    }
    
    func int(_ forKey: String) -> Int? {
        return self[forKey] as? Int
    }
    
    func data(_ forKey: String) -> Data? {
        if let hexString = string(forKey) {
            return Data(hexString: hexString)
        } else { return nil }
    }
}

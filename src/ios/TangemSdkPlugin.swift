import TangemSdk

@objc(TangemSdkPlugin) class TangemSdkPlugin: CDVPlugin {
    
    @available(iOS 13.0, *)
    private lazy var sdk: TangemSdk = {
        return TangemSdk()
    }()
    
    override func pluginInitialize() {
    }
    
    @available(iOS 13.0, *)
    @objc(scanCard:) func scanCard(command: CDVInvokedUrlCommand) {
        sdk.scanCard(initialMessage: command.params?.getArg(.initialMessage),
                     pin1: command.params?.getArg(.pin1)) {[weak self] result in
                        self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(sign:) func sign(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let hexHashes: [String] = params?.getArg(.hashes) else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }
        
        sdk.sign(hashes: hexHashes.compactMap({Data(hexString: $0)}),
                 cardId: params?.getArg(.cid),
                 initialMessage: params?.getArg(.initialMessage),
                 pin1: command.params?.getArg(.pin1),
                 pin2: command.params?.getArg(.pin2)) {[weak self] result in
                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(readIssuerData:) func readIssuerData(command: CDVInvokedUrlCommand) {
        sdk.readIssuerData(cardId: command.params?.getArg(.cid),
                           initialMessage: command.params?.getArg(.initialMessage),
                           pin1: command.params?.getArg(.pin1)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(writeIssuerData:) func writeIssuerData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cid: String = params?.getArg(.cid),
            let issuerData: Data = params?.getArg(.issuerData),
            let issuerDataSignature: Data = params?.getArg(.issuerDataSignature)  else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }
        
        let issuerDataCounter: Int? = params?.getArg(.issuerDataCounter)
        sdk.writeIssuerData(cardId: cid,
                            issuerData: issuerData,
                            issuerDataSignature: issuerDataSignature,
                            issuerDataCounter: issuerDataCounter,
                            initialMessage: params?.getArg(.initialMessage),
                            pin1: command.params?.getArg(.pin1)) {[weak self] result in
                                self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(readIssuerExtraData:) func readIssuerExtraData(command: CDVInvokedUrlCommand) {
        sdk.readIssuerExtraData(cardId: command.params?.getArg(.pin1),
                                initialMessage: command.params?.getArg(.initialMessage),
                                pin1: command.params?.getArg(.pin1)) {[weak self] result in
                                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(writeIssuerExtraData:) func writeIssuerExtraData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cid: String = params?.getArg(.cid),
            let issuerData: Data = params?.getArg(.issuerData),
            let startingSignature: Data = params?.getArg(.startingSignature),
            let finalizingSignature: Data = params?.getArg(.finalizingSignature) else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }
        
        sdk.writeIssuerExtraData(cardId: cid,
                                 issuerData: issuerData,
                                 startingSignature: startingSignature,
                                 finalizingSignature: finalizingSignature,
                                 issuerDataCounter: params?.getArg(.issuerDataCounter),
                                 initialMessage: params?.getArg(.initialMessage),
                                 pin1: command.params?.getArg(.pin1)) {[weak self] result in
                                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(readUserData:) func readUserData(command: CDVInvokedUrlCommand) {
        sdk.readUserData(cardId: command.params?.getArg(.cid),
                         initialMessage: command.params?.getArg(.initialMessage),
                         pin1: command.params?.getArg(.pin1)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(writeUserData:) func writeUserData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let userData: Data = params?.getArg(.userData) else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }
        
        sdk.writeUserData(cardId: params?.getArg(.cid),
                          userData: userData,
                          userCounter: params?.getArg(.userCounter),
                          initialMessage: params?.getArg(.initialMessage),
                          pin1: command.params?.getArg(.pin1)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(writeUserProtectedData:) func writeUserProtectedData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cid: String = params?.getArg(.cid),
            let userProtectedData: Data = params?.getArg(.userProtectedData) else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }
        
        sdk.writeUserProtectedData(cardId: cid,
                                   userProtectedData: userProtectedData,
                                   userProtectedCounter: params?.getArg(.userProtectedCounter),
                                   initialMessage: params?.getArg(.initialMessage),
                                   pin1: command.params?.getArg(.pin1)) {[weak self] result in
                                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(createWallet:) func createWallet(command: CDVInvokedUrlCommand) {
        sdk.createWallet(cardId: command.params?.getArg(.cid),
                         initialMessage: command.params?.getArg(.initialMessage),
                         pin1: command.params?.getArg(.pin1),
                         pin2: command.params?.getArg(.pin2)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(purgeWallet:) func purgeWallet(command: CDVInvokedUrlCommand) {
        sdk.purgeWallet(cardId: command.params?.getArg(.cid),
                        initialMessage: command.params?.getArg(.initialMessage),
                        pin1: command.params?.getArg(.pin1),
                        pin2: command.params?.getArg(.pin2)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(changePin1:) func changePin1(command: CDVInvokedUrlCommand)  {
        let pin: String? = command.params?.getArg(.pinCode)
        
        sdk.changePin1(cardId: command.params?.getArg(.cid),
                       pin: pin?.sha256(),
                       initialMessage: command.params?.getArg(.initialMessage)) { [weak self] result in
                        self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(changePin2:) func changePin2(command: CDVInvokedUrlCommand) {
        let pin: String? = command.params?.getArg(.pinCode)
        
        sdk.changePin2(cardId: command.params?.getArg(.cid),
                       pin: pin?.sha256(),
                       initialMessage: command.params?.getArg(.initialMessage)) { [weak self] result in
                        self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @available(iOS 13.0, *)
    @objc(verify:) func verify(command: CDVInvokedUrlCommand) {
        if let online: Bool = command.params?.getArg(.online) {
            sdk.verify(cardId: command.params?.getArg(.cid),
                       online: online,
                       initialMessage: command.params?.getArg(.initialMessage),
                       pin1: command.params?.getArg(.pin1)) { [weak self] result in
                        self?.handleResult(result, callbackId: command.callbackId) }
        } else {
            sdk.verify(cardId: command.params?.getArg(.cid),
                       initialMessage: command.params?.getArg(.initialMessage),
                       pin1: command.params?.getArg(.pin1)) { [weak self] result in
                        self?.handleResult(result, callbackId: command.callbackId)
            }
        }
    }
    
    private func handleMissingArgs(callbackId: String) {
        let missingArgsError = PluginError(code: 9999, localizedDescription: "Some arguments are missing or wrong")
        let errorResult = CDVPluginResult(status: .error, messageAs:  missingArgsError.jsonDescription)
        commandDelegate.send(errorResult, callbackId: callbackId)
    }
    
    private func handleResult<TResult: ResponseCodable>(_ result: Result<TResult, TangemSdkError>, callbackId: String) {
        var cdvresult: CDVPluginResult
        switch result {
        case .success(let response):
            cdvresult = CDVPluginResult(status: .ok, messageAs: response.description)
        case .failure(let error):
            cdvresult = CDVPluginResult(status: .error, messageAs: error.toPluginError().jsonDescription)
        }
        commandDelegate.send(cdvresult, callbackId: callbackId)
    }
}

fileprivate extension CDVInvokedUrlCommand {
    var params: [String: Any]? {
        arguments.first as? [String: Any]
    }
}

fileprivate enum ArgKey: String {
    case pin1
    case pin2
    case cid
    case hashes
    case userCounter
    case userProtectedCounter
    case userData
    case issuerDataCounter
    case userProtectedData
    case issuerDataSignature
    case issuerData
    case issuerPrivateKey
    case issuer
    case manufacturer
    case acquirer
    case cardConfig
    case pinCode
    case initialMessage
    case startingSignature
    case finalizingSignature
    case online
}

fileprivate extension Dictionary where Key == String, Value == Any {
    func getArg<T: Decodable>(_ key: ArgKey) -> T? {
        if let value = self[key.rawValue] {
            if T.self == Data.self {
                if let hex = value as? String {
                    return Data(hexString: hex) as? T
                } else {
                    return nil
                }
            } else {
                if let decoded: T = decodeObject(value) {
                    return decoded
                } else {
                    return value as? T
                }
            }
        } else {
            return nil
        }
    }
    
    private func decodeObject<T: Decodable>(_ value: Any) -> T? {
        if let json = value as? String, let jsonData = json.data(using: .utf8) {
            do {
                return try JSONDecoder.tangemSdkDecoder.decode(T.self, from: jsonData)
            } catch {
                print(error)
                return nil
            }
        } else {
            return nil
        }
    }
}

fileprivate struct PluginError: Encodable {
    let code: Int
    let localizedDescription: String
    
    var jsonDescription: String {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys, .prettyPrinted]
        let data = (try? encoder.encode(self)) ?? Data()
        return String(data: data, encoding: .utf8)!
    }
}

fileprivate extension TangemSdkError {
    func toPluginError() -> PluginError {
        return PluginError(code: self.code, localizedDescription: self.localizedDescription)
    }
}

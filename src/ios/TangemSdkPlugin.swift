import TangemSdk

@available(iOS 13.0, *)
@objc(TangemSdkPlugin) class TangemSdkPlugin: CDVPlugin {
    
    private lazy var sdk: TangemSdk = {
        return TangemSdk()
    }()

    override func pluginInitialize() {
    }

    @objc(readIssuerData:) func readIssuerData(command: CDVInvokedUrlCommand) {
        sdk.readIssuerData(cardId: command.params?.getArg(.cardId),
                           initialMessage: command.params?.getArg(.initialMessage)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }

    @objc(writeIssuerData:) func writeIssuerData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let issuerData: Data = params?.getArg(.issuerData),
            let issuerDataSignature: Data = params?.getArg(.issuerDataSignature)  else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }

        sdk.writeIssuerData(issuerData: issuerData,
                            issuerDataSignature: issuerDataSignature,
                            issuerDataCounter: params?.getArg(.issuerDataCounter),
                            cardId: params?.getArg(.cardId),
                            initialMessage: params?.getArg(.initialMessage)) {[weak self] result in
                                self?.handleResult(result, callbackId: command.callbackId)
        }
    }

    @objc(readIssuerExtraData:) func readIssuerExtraData(command: CDVInvokedUrlCommand) {
        sdk.readIssuerExtraData(cardId: command.params?.getArg(.pin1),
                                initialMessage: command.params?.getArg(.initialMessage)) {[weak self] result in
                                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }

    @objc(writeIssuerExtraData:) func writeIssuerExtraData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let issuerData: Data = params?.getArg(.issuerData),
            let startingSignature: Data = params?.getArg(.startingSignature),
            let finalizingSignature: Data = params?.getArg(.finalizingSignature) else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }

        sdk.writeIssuerExtraData(issuerData: issuerData,
                                 startingSignature: startingSignature,
                                 finalizingSignature: finalizingSignature,
                                 issuerDataCounter: params?.getArg(.issuerDataCounter),
                                 cardId: params?.getArg(.cardId),
                                 initialMessage: params?.getArg(.initialMessage)) {[weak self] result in
                                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }

    @objc(readUserData:) func readUserData(command: CDVInvokedUrlCommand) {
        sdk.readUserData(cardId: command.params?.getArg(.cardId),
                         initialMessage: command.params?.getArg(.initialMessage)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }

    @objc(writeUserData:) func writeUserData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let userData: Data = params?.getArg(.userData) else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }

        sdk.writeUserData(userData: userData,
                          userCounter: params?.getArg(.userCounter),
                          cardId: params?.getArg(.cardId),
                          initialMessage: params?.getArg(.initialMessage)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }

    @objc(writeUserProtectedData:) func writeUserProtectedData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let userProtectedData: Data = params?.getArg(.userProtectedData) else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }

        sdk.writeUserProtectedData(userProtectedData: userProtectedData,
                                   userProtectedCounter: params?.getArg(.userProtectedCounter),
                                   cardId: params?.getArg(.cardId),
                                   initialMessage: params?.getArg(.initialMessage)) {[weak self] result in
                                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }

    @objc(runJSONRPCRequest:) func runJSONRPCRequest(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let request: String = params?.getArg(.JSONRPCRequest) else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }

        sdk.startSession(with: request,
                         cardId: params?.getArg(.cardId),
                         initialMessage: params?.getArg(.initialMessage),
                         accessCode: params?.getArg(.accessCode)) {[weak self] result in
                           self?.handleJSONRPCResult(result, callbackId: command.callbackId)
        }

    }

    private func handleMissingArgs(callbackId: String) {
        let missingArgsError = PluginError(code: 9999, localizedDescription: "Some arguments are missing or wrong")
        let errorResult = CDVPluginResult(status: .error, messageAs:  missingArgsError.jsonDescription)
        commandDelegate.send(errorResult, callbackId: callbackId)
    }

    private func handleJSONRPCResult(_ result: String, callbackId: String) {
        let cdvresult: CDVPluginResult = CDVPluginResult(status: .ok, messageAs: result)
        commandDelegate.send(cdvresult, callbackId: callbackId)
    }

    private func handleResult<TResult: JSONStringConvertible>(_ result: Result<TResult, TangemSdkError>, callbackId: String) {
        var cdvresult: CDVPluginResult
        switch result {
        case .success(let response):
            cdvresult = CDVPluginResult(status: .ok)
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
    case cardId
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
    case accessCode
    case startingSignature
    case finalizingSignature
    case online
    case files
    case readPrivateFiles
    case indices
    case changes
    case walletPublicKey
    case config
    case JSONRPCRequest
}

@available(iOS 13.0, *)
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
            if let array = value as? NSMutableArray,
               let jsonData = try? JSONSerialization.data(withJSONObject: array, options: []),
               let decoded = try? JSONDecoder.tangemSdkDecoder.decode(T.self, from: jsonData) {
                return decoded
            } else {
                return nil
            }
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

@available(iOS 13.0, *)
fileprivate extension TangemSdkError {
    func toPluginError() -> PluginError {
        return PluginError(code: self.code, localizedDescription: self.localizedDescription)
    }
}

fileprivate extension String {
    func toData() -> Data {
        Data(hexString: self)
    }
}

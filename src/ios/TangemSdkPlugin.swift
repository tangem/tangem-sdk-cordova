import TangemSdk

@objc(TangemSdkPlugin) class TangemSdkPlugin: CDVPlugin {
    private var _sdk: Any?

    @available(iOS 13, *)
    private var sdk: TangemSdk {
        if _sdk == nil {
            _sdk = TangemSdk()
        }
        return _sdk as! TangemSdk
    }
    
    @objc(runJSONRPCRequest:) func runJSONRPCRequest(command: CDVInvokedUrlCommand) {
        guard #available(iOS 13, *) else {
            handleOldIOS(callbackId: command.callbackId)
            return
        }
        
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

    private func handleOldIOS(callbackId: String) {
        let oldIOSMessage = PluginError(code: 9998, localizedDescription: "TangemSDK does not support this version of iOS")
        let errorResult = CDVPluginResult(status: .error, messageAs: oldIOSMessage.jsonDescription)
        commandDelegate.send(errorResult, callbackId: callbackId)
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

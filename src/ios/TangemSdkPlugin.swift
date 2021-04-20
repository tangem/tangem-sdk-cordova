import TangemSdk

@objc(TangemSdkPlugin) class TangemSdkPlugin: CDVPlugin {
    private lazy var sdk: TangemSdk = {
        return TangemSdk()
    }()
    
    override func pluginInitialize() {
    }
    
    @objc(scanCard:) func scanCard(command: CDVInvokedUrlCommand) {
        sdk.scanCard(initialMessage: command.params?.getArg(.initialMessage)) {[weak self] result in
            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(sign:) func sign(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let hexHashes: [String] = params?.getArg(.hashes) else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }
        
        sdk.sign(hashes: hexHashes.compactMap({Data(hexString: $0)}),
                 cardId: params?.getArg(.cardId),
                 initialMessage: params?.getArg(.initialMessage),
                 pin1: command.params?.getArg(.pin1),
                 pin2: command.params?.getArg(.pin2)) {[weak self] result in
                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(readIssuerData:) func readIssuerData(command: CDVInvokedUrlCommand) {
        sdk.readIssuerData(cardId: command.params?.getArg(.cardId),
                           initialMessage: command.params?.getArg(.initialMessage),
                           pin1: command.params?.getArg(.pin1)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(writeIssuerData:) func writeIssuerData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cardId: String = params?.getArg(.cardId),
            let issuerData: Data = params?.getArg(.issuerData),
            let issuerDataSignature: Data = params?.getArg(.issuerDataSignature)  else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }
        
        let issuerDataCounter: Int? = params?.getArg(.issuerDataCounter)
        sdk.writeIssuerData(cardId: cardId,
                            issuerData: issuerData,
                            issuerDataSignature: issuerDataSignature,
                            issuerDataCounter: issuerDataCounter,
                            initialMessage: params?.getArg(.initialMessage),
                            pin1: command.params?.getArg(.pin1)) {[weak self] result in
                                self?.handleResult(result, callbackId: command.callbackId)
        }
    }

    @objc(readIssuerExtraData:) func readIssuerExtraData(command: CDVInvokedUrlCommand) {
        sdk.readIssuerExtraData(cardId: command.params?.getArg(.pin1),
                                initialMessage: command.params?.getArg(.initialMessage),
                                pin1: command.params?.getArg(.pin1)) {[weak self] result in
                                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(writeIssuerExtraData:) func writeIssuerExtraData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cardId: String = params?.getArg(.cardId),
            let issuerData: Data = params?.getArg(.issuerData),
            let startingSignature: Data = params?.getArg(.startingSignature),
            let finalizingSignature: Data = params?.getArg(.finalizingSignature) else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }
        
        sdk.writeIssuerExtraData(cardId: cardId,
                                 issuerData: issuerData,
                                 startingSignature: startingSignature,
                                 finalizingSignature: finalizingSignature,
                                 issuerDataCounter: params?.getArg(.issuerDataCounter),
                                 initialMessage: params?.getArg(.initialMessage),
                                 pin1: command.params?.getArg(.pin1)) {[weak self] result in
                                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(readUserData:) func readUserData(command: CDVInvokedUrlCommand) {
        sdk.readUserData(cardId: command.params?.getArg(.cardId),
                         initialMessage: command.params?.getArg(.initialMessage),
                         pin1: command.params?.getArg(.pin1)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(writeUserData:) func writeUserData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let userData: Data = params?.getArg(.userData) else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }
        
        sdk.writeUserData(cardId: params?.getArg(.cardId),
                          userData: userData,
                          userCounter: params?.getArg(.userCounter),
                          initialMessage: params?.getArg(.initialMessage),
                          pin1: command.params?.getArg(.pin1)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(writeUserProtectedData:) func writeUserProtectedData(command: CDVInvokedUrlCommand) {
        let params = command.params
        guard let cardId: String = params?.getArg(.cardId),
            let userProtectedData: Data = params?.getArg(.userProtectedData) else {
                handleMissingArgs(callbackId: command.callbackId)
                return
        }
        
        sdk.writeUserProtectedData(cardId: cardId,
                                   userProtectedData: userProtectedData,
                                   userProtectedCounter: params?.getArg(.userProtectedCounter),
                                   initialMessage: params?.getArg(.initialMessage),
                                   pin1: command.params?.getArg(.pin1)) {[weak self] result in
                                    self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(createWallet:) func createWallet(command: CDVInvokedUrlCommand) {
        sdk.createWallet(cardId: command.params?.getArg(.cardId),
                         initialMessage: command.params?.getArg(.initialMessage),
                         pin1: command.params?.getArg(.pin1),
                         pin2: command.params?.getArg(.pin2)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(purgeWallet:) func purgeWallet(command: CDVInvokedUrlCommand) {
        sdk.purgeWallet(cardId: command.params?.getArg(.cardId),
                        initialMessage: command.params?.getArg(.initialMessage),
                        pin1: command.params?.getArg(.pin1),
                        pin2: command.params?.getArg(.pin2)) {[weak self] result in
                            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(changePin1:) func changePin1(command: CDVInvokedUrlCommand)  {
        let pin: String? = command.params?.getArg(.pinCode)
        
        sdk.changePin1(cardId: command.params?.getArg(.cardId),
                       pin: pin?.sha256(),
                       initialMessage: command.params?.getArg(.initialMessage)) { [weak self] result in
                        self?.handleResult(result, callbackId: command.callbackId)
        }
    }

    @objc(changePin2:) func changePin2(command: CDVInvokedUrlCommand) {
        let pin: String? = command.params?.getArg(.pinCode)
        
        sdk.changePin2(cardId: command.params?.getArg(.cardId),
                       pin: pin?.sha256(),
                       initialMessage: command.params?.getArg(.initialMessage)) { [weak self] result in
                        self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(verify:) func verify(command: CDVInvokedUrlCommand) {
        if let online: Bool = command.params?.getArg(.online) {
            sdk.verify(cardId: command.params?.getArg(.cardId),
                       online: online,
                       initialMessage: command.params?.getArg(.initialMessage),
                       pin1: command.params?.getArg(.pin1)) { [weak self] result in
                        self?.handleResult(result, callbackId: command.callbackId) }
        } else {
            sdk.verify(cardId: command.params?.getArg(.cardId),
                       initialMessage: command.params?.getArg(.initialMessage),
                       pin1: command.params?.getArg(.pin1)) { [weak self] result in
                        self?.handleResult(result, callbackId: command.callbackId)
            }
        }
    }
    
    @objc(readFiles:) func readFiles(command: CDVInvokedUrlCommand) {
        let readPrivateFiles: Bool = command.params?.getArg(.readPrivateFiles) ?? false
        sdk.readFiles(cardId: command.params?.getArg(.cardId),
                      initialMessage: command.params?.getArg(.initialMessage),
                      pin1: command.params?.getArg(.pin1),
                      pin2: command.params?.getArg(.pin2),
                      readSettings: ReadFilesTaskSettings(readPrivateFiles: readPrivateFiles)) { [weak self] result in
            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(writeFiles:) func writeFiles(command: CDVInvokedUrlCommand) {
        guard let fileWrappers: [FileDataWrapper] = command.params?.getArg(.files) else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }
        
        sdk.writeFiles(cardId: command.params?.getArg(.cardId),
                       initialMessage: command.params?.getArg(.initialMessage),
                       pin1: command.params?.getArg(.pin1),
                       pin2: command.params?.getArg(.pin2),
                       files: fileWrappers.map { $0.dataToWrite }) { [weak self] result in
            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(deleteFiles:) func deleteFiles(command: CDVInvokedUrlCommand) {
        sdk.deleteFiles(cardId: command.params?.getArg(.cardId),
                        initialMessage: command.params?.getArg(.initialMessage),
                        pin1: command.params?.getArg(.pin1),
                        pin2: command.params?.getArg(.pin2),
                        indicesToDelete: command.params?.getArg(.indices)) { [weak self] result in
            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    @objc(changeFilesSettings:) func changeFilesSettings(command: CDVInvokedUrlCommand) {
        guard let changes: [FileSettingsChangeWrapper] = command.params?.getArg(.changes) else {
            handleMissingArgs(callbackId: command.callbackId)
            return
        }
        
        sdk.changeFilesSettings(cardId: command.params?.getArg(.cardId),
                                initialMessage: command.params?.getArg(.initialMessage),
                                pin1: command.params?.getArg(.pin1),
                                pin2: command.params?.getArg(.pin2),
                                files: changes.map { $0.file }) { [weak self] result in
            self?.handleResult(result, callbackId: command.callbackId)
        }
    }
    
    private func handleMissingArgs(callbackId: String) {
        let missingArgsError = PluginError(code: 9999, localizedDescription: "Some arguments are missing or wrong")
        let errorResult = CDVPluginResult(status: .error, messageAs:  missingArgsError.jsonDescription)
        commandDelegate.send(errorResult, callbackId: callbackId)
    }
    
    private func handleResult<TResult: JSONStringConvertible>(_ result: Result<TResult, TangemSdkError>, callbackId: String) {
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
    case startingSignature
    case finalizingSignature
    case online
    case files
    case readPrivateFiles
    case indices
    case changes
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

fileprivate extension TangemSdkError {
    func toPluginError() -> PluginError {
        return PluginError(code: self.code, localizedDescription: self.localizedDescription)
    }
}

fileprivate struct FileDataWrapper: Codable {
    let data: String
    let counter: Int?
    let signature: FileDataSignature?
    let issuerPublicKey: String?
    
    var dataToWrite: DataToWrite {
        let data = self.data.toData()
        if let counter = counter, let signature = signature {
            return FileDataProtectedBySignature(data: data,
                                                startingSignature: signature.startingSignature.toData(),
                                                finalizingSignature: signature.finalizingSignature.toData(),
                                                counter: counter,
                                                issuerPublicKey: issuerPublicKey?.toData())
        } else {
            return FileDataProtectedByPasscode(data: data)
        }
    }
}

fileprivate struct FileDataSignature: Codable {
    let startingSignature: String
    let finalizingSignature: String
}

fileprivate extension String {
    func toData() -> Data {
        Data(hexString: self)
    }
}

fileprivate struct FileSettingsChangeWrapper: Codable {
    let fileIndex: Int
    let settings: Int
    
    var file: File {
        File(fileIndex: fileIndex,
             fileSettings: FileSettings(rawValue: settings),
             fileData: Data())
    }
}

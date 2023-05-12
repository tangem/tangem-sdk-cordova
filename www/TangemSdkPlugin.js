var cordovaExec = require('cordova/exec');

var TangemSdk = {
	/** Wrapper for a message that can be shown to user after a start of NFC session.
	 * @typedef {Object} Message
	 * @property {string} [body] Body of message
	 * @property {string} [header] Header of message
	 */

	/**
	 * The callback for error.
	 * @callback errorCallback
	 * @param {TangemSdkError} error
	 * @return {void}
	 */

	/**
	 * Firmware Type ("d SDK", "r", "special")
	 * @typedef {string} FirmwareType
	 */

	/**
	 * Stores and maps Tangem card settings
	 * @typedef {string} SettingsMask
	 */

	/**
	 * Elliptic curve used for wallet key operations.
	 * @typedef {"secp256k1"|"ed25519"|"secp256r1"} EllipticCurve
	 */

	/**
	 * Encryption Mode
	 * @typedef {"none"|"fast"|"strong"} EncryptionMode
	 */

	/**
	 * Linked Terminal Status
	 * @typedef {"current"|"other"|"none"} LinkedTerminalStatus
	 */


	/**
	 * Determines which type of data is required for signing
	 * @typedef {"string"} SigningMethod
	 */

	/**
	 * @typedef {"failed"|"warning"|"skipped"|"verifiedOffline"|"verified"} Status
	 */

	/** @typedef {string} Data */

	/**
	 * @typedef {Object} FirmwareVersion Holds information about card firmware version included version saved on card `version`,
	 *  splitted to `major`, `minor` and `hotFix` and `FirmwareType`
	 * @property {number} hotFix
	 * @property {number} major
	 * @property {number} minor
	 * @property {FirmwareType} type
	 * @property {string} version
	 */

	/**
	 * @typedef {Object} SuccessResponse
	 * @property {string} cardId Unique Tangem card ID number.
	 */

	/**
	 * @callback SuccessCallback
	 * @param {SuccessResponse} response
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * The callback.
	 * @callback CommonCallback
	 * @param {Object} [response]
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * Error of TangemSdk
	 * @typedef {Object} TangemSdkError
	 * @property {number} code
	 * @property {string} localizedDescription
	 */

	/**
	 * @typedef WalletSettings
	 * @property {boolean} isPermanent if true, erasing the wallet will be prohibited
	 */

	/**
	 * @typedef Wallet
	 * @property {Data} publicKey Public key of the blockchain wallet.
	 * @property {Data} [chainCode] Optional chain code for BIP32 derivation.
	 * @property {EllipticCurve} curve Elliptic curve used for all wallet key operations.
	 * @property {WalletSettings} Wallet's settings
	 * @property {number} [totalSignedHashes] Total number of signed hashes returned by the wallet since its creation
	 * @property {number} [remainingSignatures] Remaining number of `Sign` operations before the wallet will stop signing any data.
	 * - Note: This counter were deprecated for cards with COS 4.0 and higher
	 * @property {number} index Index of wallet in card storage.
	 */

	/**
	 * @typedef Manufacturer
	 * @property {string} name Card manufacturer name.
	 * @property {Date} manufactureDate Timestamp of manufacturing.
	 * @property {Data} Signature of CardId with manufacturer’s private key. COS 1.21+
	 */

	/**
	 * @typedef Issuer
	 * @property {string} name Name of the issuer.
	 * @property {Data} publicKey Public key that is used by the card issuer to sign IssuerData field.
	 */

	/**
	 * @typedef Settings
	 * @property {number} securityDelay Delay in milliseconds before executing a command that affects any sensitive data or wallets on the card
	 * @property {number} maxWalletsCount Maximum number of wallets that can be created for this card
	 * @property {boolean} isSettingAccessCodeAllowed Is allowed to change access code
	 * @property {boolean} isSettingPasscodeAllowed Is allowed to change passcode
	 * @property {boolean} isRemovingAccessCodeAllowed Is allowed to remove access code
	 * @property {boolean} isLinkedTerminalEnabled Is LinkedTerminal feature enabled
	 * @property {EncryptionMode[]} supportedEncryptionModes All encryption modes supported by the card
	 * @property {boolean} isPermanentWallet Is allowed to delete wallet. COS before v4
	 * @property {boolean} isOverwritingIssuerExtraDataRestricted Is overwriting issuer extra data restricted
	 * @property {SigningMethod} [defaultSigningMethods] Card's default signing methods according personalization.
	 * @property {EllipticCurve} [defaultCurve] Card's default curve according personalization.
	 * @property {boolean} isIssuerDataProtectedAgainstReplay
	 * @property {boolean} isSelectBlockchainAllowed
	 */

	/**
	 * @typedef Attestation
	 * @property {Status} cardKeyAttestation Attestation status of card's public key
	 * @property {Status} walletKeysAttestation Attestation status of all wallet public key in the card
	 * @property {Status} firmwareAttestation Attestation status of card's firmware. Not implemented for this time
	 * @property {Status} cardUniquenessAttestation Attestation status of card's uniqueness. Not implemented for this time
	 */

	/**
	 * @typedef {Object} Card Response for `ReadCommand`. Contains detailed card information
	 * @property {string} cardId Unique Tangem card ID number.
	 * @property {string} batchId Tangem internal manufacturing batch ID.
	 * @property {Data} cardPublicKey Public key that is used to authenticate the card against manufacturer’s database. It is generated one time during card manufacturing.
	 * @property {FirmwareVersion} firmwareVersion Version of Tangem COS.
	 * @property {Manufacturer} manufacturer Information about manufacturer
	 * @property {Issuer} issuer Information about issuer
	 * @property {Settings} settings Card setting, that were set during the personalization process
	 * @property {LinkedTerminalStatus} linkedTerminalStatus When this value is `current`, it means that the application is linked to the card,
	 * and COS will not enforce security delay if `SignCommand` will be called
	 * with `TlvTag.TerminalTransactionSignature` parameter containing a correct signature of raw data
	 * to be signed made with `TlvTag.TerminalPublicKey`.
	 * @property {boolean} [isPasscodeSet] PIN2 (aka Passcode) is set. Available only for cards with COS v.4.0 and higher.
	 * @property {EllipticCurve[]} supportedCurves Array of elliptic curves, supported by this card. Only wallets with these curves can be created.
	 * @property {Wallet[]} [wallets] Wallets, created on the card, that can be used for signature
	 * @property {Attestation} attestation Card's attestation report
	 * @property {number} [health] Any non-zero value indicates that the card experiences some hardware problems.
	 * User should withdraw the value to other blockchain wallet as soon as possible.
	 * Non-zero Health tag will also appear in responses of all other commands.
	 * @property {number} [remainingSignatures] Remaining number of `SignCommand` operations before the wallet will stop signing transactions.
	 * This counter were deprecated for cards with COS 4.0 and higher

	/**
	 * The callback for success scan card.
	 * @callback ScanCardCallback
	 * @param {Card} [response]
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * To start using any card, you first need to read it using the `scanCard()` method.
	 * This method launches an NFC session, and once it’s connected with the card,
	 * it obtains the card data. optionally, if the card contains a wallet (private and public key pair),
	 * it proves that the wallet owns a private key that corresponds to a public one.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {ScanCardCallback} [callback] Callback for command
	 */
	scanCard: function (initialMessage, callback) {
		execJsonRPCRequest(
			getJsonRPCRequest('scan'),
			undefined,
			initialMessage,
			undefined,
			callback
		);
	},



   /**
    * To start using any card, you first need to read it using the scanCard() method.
    * This method launches an NFC session, and once it’s connected with the card,
    * it obtains the card data. Optionally, if the card contains a wallet (private and public key pair),
    * it proves that the wallet owns a private key that corresponds to a public one.
    *
    * @param challenge Optional challenge. If null, it will be created automatically and returned in command response.
    * @param cardId CID, Unique Tangem card ID number.
    * @param initialMessage A custom description that shows at the beginning of the NFC session.
    * If null, default message will be used.
    * @param callback is triggered on the completion of the [ScanTask] and provides card response.
    * in the form of [Card] if the task was performed successfully or [TangemSdkError] in case of an error.
    */
    attestCardKey: function (challenge, cardId, initialMessage, callback) {
    	execJsonRPCRequest(
    		getJsonRPCRequest('attest_card_key', { challenge: challenge }),
    		cardId,
    		initialMessage,
    		undefined,
    		callback
    	);
    },

	/**
	 * @typedef {Object} SignHashResponse
	 * @property {string} cardId Unique Tangem card ID number.
	 * @property {Data} signature Signed hash
	 * @property {number} [totalSignedHashes] Total number of signed  hashes returned by the wallet since its creation. COS: 1.16+
	 */

	/**
	 * The callback for success signHash.
	 * @callback SignHashCallback
	 * @param {SignHashCallback} [response] Signed hashes (array of resulting signatures)
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * This method allows you to sign one hash and will return a corresponding signature.
	 * Please note that Tangem cards usually protect the signing with a security delay
	 * that may last up to 45 seconds, depending on a card.
	 * It is for `SessionViewDelegate` to notify users of security delay.
	 * Note: Wallet index works only on COS v.4.0 and higher. For previous version index will be ignored
	 * @param {Data} hash Array of transaction hashes. It can be from one or up to ten hashes of the same length.
	 * @param {Data} walletPublicKey Public key of wallet that should sign hashes.
	 * @param {string} [hdPath] Public Derivation path of the wallet. Optional. COS v. 4.28 and higher
	 * @param {string} cardId Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SignHashCallback} [callback] Callback for result
	 */
	signHash: function (hash, walletPublicKey, hdPath, cardId, initialMessage, callback) {
		execJsonRPCRequest(
			getJsonRPCRequest('sign_hash', { walletPublicKey: walletPublicKey, hdPath: hdPath, hash: hash }),
			cardId,
			initialMessage,
			undefined,
			callback
		);
	},

	/**
	 * @typedef {Object} SignHashResponse
	 * @property {string} cardId Unique Tangem card ID number.
	 * @property {Data[]} signatures Signed hashes (array of resulting signatures)
	 * @property {number} [totalSignedHashes] Total number of signed  hashes returned by the wallet since its creation. COS: 1.16+
	 */

	/**
	 * The callback for success signHashes.
	 * @callback SignHashCallback
	 * @param {SignHashCallback} [response] Signed hashes (array of resulting signatures)
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * This method allows you to sign one or multiple hashes.
	 * Simultaneous signing of array of hashes in a single `SignCommand` is required to support
	 * Bitcoin-type multi-input blockchains (UTXO).
	 * The `SignCommand` will return a corresponding array of signatures.
	 * Please note that Tangem cards usually protect the signing with a security delay
	 * that may last up to 45 seconds, depending on a card.
	 * It is for `SessionViewDelegate` to notify users of security delay.
	 * Note: Wallet index works only on COS v.4.0 and higher. For previous version index will be ignored
	 * @param {Data[]} hashes Array of transaction hashes. It can be from one or up to ten hashes of the same length.
	 * @param {Data} walletPublicKey Public key of wallet that should sign hashes.
	 * @param {string} [hdPath] Public Derivation path of the wallet. Optional. COS v. 4.28 and higher
	 * @param {string} cardId Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SignCallback} [callback] Callback for result
	 */
	signHashes: function (hashes, walletPublicKey, hdPath, cardId, initialMessage, callback) {
		execJsonRPCRequest(
			getJsonRPCRequest('sign_hashes', { walletPublicKey: walletPublicKey, hdPath: hdPath, hashes: hashes }),
			cardId,
			initialMessage,
			undefined,
			callback
		);
	},

	/**
	 * @typedef {Object} CreateWalletResponse
	 * @property {string} cardId Unique Tangem card ID number.
	 * @property {Wallet} wallet Created wallet
	 */

	/**
	 * @callback CreateWalletCallback
	 * @param {CreateWalletResponse} [response]
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * This command will create a new wallet on the card having ‘Empty’ state.
	 * A key pair WalletPublicKey / WalletPrivateKey is generated and securely stored in the card.
	 * App will need to obtain Wallet_PublicKey from the response of `CreateWalletCommand` or `ReadCommand`
	 * and then transform it into an address of corresponding blockchain wallet
	 * according to a specific blockchain algorithm.
	 * WalletPrivateKey is never revealed by the card and will be used by `SignCommand` and `CheckWalletCommand`.
	 * RemainingSignature is set to MaxSignatures.
	 * @param {EllipticCurve} curve Wallet's elliptic curve
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {CreateWalletCallback} [callback] Callback for result
	 */
	createWallet: function (curve, cardId, initialMessage, callback) {
		execJsonRPCRequest(
			getJsonRPCRequest('create_wallet', { curve: curve }),
			cardId,
			initialMessage,
			undefined,
			callback
		);
	},

	/**
	 * This command deletes all wallet data. If Is_Reusable flag is enabled during personalization,
	 * the card changes state to ‘Empty’ and a new wallet can be created by `CREATE_WALLET` command.
	 * If Is_Reusable flag is disabled, the card switches to ‘Purged’ state.
	 * ‘Purged’ state is final, it makes the card useless.
	 * - Note: Wallet index available for cards with COS v.4.0 or higher
	 * @param {Data} walletPublicKey Public key of wallet that should be purged.
	 * @param {string} cardId Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SuccessCallback} [callback] Callback for result
	 */
	purgeWallet: function (walletPublicKey, cardId, initialMessage, callback) {
		execJsonRPCRequest(
			getJsonRPCRequest('purge_wallet',{ walletPublicKey: walletPublicKey}),
			cardId,
			initialMessage,
			undefined,
			callback
		);
	},

	/**
	 * Set or change card's access code
	 * @param {string} accessCode Access code to set. If nil, the user will be prompted to enter code before operation
	 * @param {string} cardId Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SuccessCallback} [callback] Callback for result
	 */
	setAccessCode: function (accessCode, cardId, initialMessage, callback) {
		execJsonRPCRequest(
			getJsonRPCRequest('set_accesscode', { accessCode: accessCode }),
			cardId,
			initialMessage,
			undefined,
			callback
		);
	},

	/**
	 * Set or change card's passcode
	 * @param {string} passcode: Passcode to set. If nil, the user will be prompted to enter code before operation
	 * @param {string} cardId Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SuccessCallback} [callback] Callback for result
	 */
	setPassCode: function (passcode, cardId, initialMessage, callback) {
		execJsonRPCRequest(
			getJsonRPCRequest('set_passcode',{ passcode: passcode }),
			cardId,
			initialMessage,
			undefined,
			callback
		);
	},

	/**
	 * Reset all user codes
	 * @param {string} cardId Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SuccessCallback} [callback] Callback for result
	 */
	resetUserCodes: function (cardId, initialMessage, callback) {
		execJsonRPCRequest(
			getJsonRPCRequest('RESET_USERCODES'),
			cardId,
			initialMessage,
			undefined,
			callback
		);
	},

	/**
	 * 0 - private, 1-public
	 * @typedef {number} FileSettings
	 */

	/**
	 * @typedef {Object} FileSettingsChange
	 * @property {number} fileIndex
	 * @property {FileSettings} settings
	 */

	/** @typedef {"notValidated"|"valid"|"corrupted"} FileValidation */

	/**
	 * @typedef {Object} File
	 * @property {Data} data
	 * @property {Data} [startingSignature]
	 * @property {Data} [finalizingSignature]
	 * @property {number} [counter]
	 * @property {Data} [issuerPublicKey]
	 * @property {boolean} [requiredPasscode]
	 * @property {FirmwareVersion} [minFirmwareVersion]
	 * @property {FirmwareVersion} [maxFirmwareVersion]
	 */

	/**
	 * @typedef {Object} ReadFilesResponse
	 * @property {File[]} files
	 */

	/**
	 * @callback ReadFilesCallback
	 * @param {ReadFilesResponse} [response]
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * This command reads all files stored on card.
	 * By default command trying to read all files (including private), to change this behaviour - setup your ` ReadFileDataTaskSetting `
	 * - Note: When performing reading private files command, you must provide `pin2`
	 * - Warning: Command available only for cards with COS 3.29 and higher
	 *
	 * @param {boolean} readPrivateFiles If true - all files saved on card will be read otherwise
	 * @param {number[]} [indices] Indices of files that should be read from card. If not specifies all files will be read.
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {ReadFilesCallback} [callback] Callback for result
	 */
	readFiles: function (readPrivateFiles, indices, cardId, initialMessage, callback) {
		execJsonRPCRequest(
			getJsonRPCRequest('read_files', { readPrivateFiles: readPrivateFiles, indices: indices }),
			cardId,
			initialMessage,
			undefined,
			callback
		);
	},

	/**
	 * @typedef {Object} WriteFilesResponse
	 * @property {string} cardId
	 * @property {number} [fileIndex]
	 */

	/**
	 * @callback WriteFilesCallback
	 * @param {WriteFilesResponse} [response]
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * This command write all files provided in `files` to card.
	 *
	 * There are 2 main implementation of `DataToWrite` protocol:
	 * - `FileDataProtectedBySignature` - for files signed by Issuer (specified on card during personalization)
	 * - `FileDataProtectedByPasscode` - write files protected by Pin2
	 *
	 * Warning: This command available for COS 3.29 and higher
	 * Note: Writing files protected by Pin2 only available for COS 3.34 and higher
	 * @param {File[]} files List of files that should be written to card
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {WriteFilesCallback} [callback] Callback for result
	 */
	writeFiles: function (files, cardId, initialMessage, callback) {
		execJsonRPCRequest(
			getJsonRPCRequest('write_files', { files: files }) ,
			cardId,
			initialMessage,
			undefined,
			callback
		);
	},

	/**
	 * This command deletes selected files from card. This operation can't be undone.
	 *
	 * To perform file deletion you should initially read all files (`readFiles` command) and add them to `indices` array. When files deleted from card, other files change their indexes.
	 * After deleting files you should additionally perform `readFiles` command to actualize files indexes
	 * Warning: This command available for COS 3.29 and higher
	 * @param {number[]} [indicesToDelete] Indexes of files that should be deleted. If nil - deletes all files from card
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SuccessCallback} [callback] Callback for result
	 */
	deleteFiles: function (indicesToDelete, cardId, initialMessage, callback) {
		execJsonRPCRequest(
			getJsonRPCRequest('delete_files', { indicesToDelete: indicesToDelete }),
			cardId,
			initialMessage,
			undefined,
			callback
		);
	},

	/**
	 * Updates selected file settings provided within `File`.
	 *
	 * To perform file settings update you should initially read all files (`readFiles` command), select files that you
	 * want to update, change their settings in `File.fileSettings` and add them to `files` array.
	 * Note: In COS 3.29 and higher only file visibility option (public or private) available to update
	 * Warning: This method works with COS 3.29 and higher
	 * @param {FileSettingsChange} changes Array of file indices with new settings
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SuccessCallback} [callback] Callback for result
	 */
	changeFilesSettings: function (changes, cardId, initialMessage, callback) {
		execJsonRPCRequest(
			getJsonRPCRequest('change_file_settings', { changes: changes }),
			cardId,
			initialMessage,
			undefined,
			callback
		);
	},

	/**
	 *Allows running a custom bunch of commands in one NFC Session by creating a custom task.
	 * Tangem SDK will start a card session, perform preflight `Read` command,
	 * invoke the `run ` method of `CardSessionRunnable` and close the session.
	 * You can find the current card in the `environment` property of the `CardSession`
	 * @param {Object} jsonRequest
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
     * @param {String} [accessCode] Access code that will be used for a card session initialization. If undefined, Tangem SDK will handle it automatically.
	 * @param {SuccessCallback} [callback] Callback for result
	 */
	runJSONRPCRequest: function (jsonRequest, cardId, initialMessage, accessCode, callback) {
		execJsonRPCRequest(
			jsonRequest,
			cardId,
			initialMessage,
			accessCode,
			callback
		);
	}
};

/**
 * Execute for Cordova
 *
 * @param {string} command Name of command
 * @param {Object} [options] Options for cordova exec
 * @param {CommonCallback} [callback] Callback
 */
function exec(command, options, callback) {
	cordovaExec(
		function (result) {
			callback && typeof callback === 'function' && callback(JSON.parse(result));
		},
		function (error) {
			callback && typeof callback === 'function' && callback(undefined, JSON.parse(error));
		},
		'TangemSdkPlugin',
		command,
		[options]
	);
}

/**
 * Create JsonRPCRequest
 * @param {string} method Name of method
 * @param {Object} [params] Options for jsonRPCRequest
 */
function getJsonRPCRequest(method, params) {
	return { jsonrpc: '2.0', id: '1', method: method, params: params || {} }
}

/**
 * Execute jsonRPCRequest
 *
 * @param {Object} [jsonRPCRequest] jsonRPCRequest
 * @param {string} [cardId] Unique Tangem card ID number.
 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
 * @param {String} [accessCode] Access code that will be used for a card session initialization. If undefined, Tangem SDK will handle it automatically.
 * @param {CommonCallback} [callback] Callback
 */
function execJsonRPCRequest(jsonRPCRequest, cardId, initialMessage, accessCode, callback) {
	exec(
		'runJSONRPCRequest', {
			JSONRPCRequest: JSON.stringify(jsonRPCRequest),
			cardId: cardId,
			initialMessage: JSON.stringify(initialMessage),
			accessCode: accessCode
		},
		function (response, error) {
			if (response && response.result) {
				return callback(response.result);
			}
			if (error) {
				return callback(undefined, error);
			}
			if (response.error) {
				return callback(undefined, response.error);
			}
			return callback(undefined, { code: 0, localizedDescription: 'Unknown error' });
		},
	);
}

module.exports = TangemSdk;

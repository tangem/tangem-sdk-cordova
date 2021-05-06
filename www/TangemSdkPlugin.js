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
	 * Mask of product (Note, Tag, IdCard, IdIssuer, TwinCard)
	 * @typedef {string} ProductMask
	 */

	/**
	 * Status of the card and its wallet. (notPersonalized, empty, loaded, purged)
	 * @typedef {string} CardStatus
	 */

	/**
	 * Status of the wallet. empty = 1, loaded = 2, purged = 3)
	 * @typedef {string} WalletStatus
	 */

	/**
	 * Firmware Type ("d SDK", "r", "special")
	 *  @typedef {string} FirmwareType
	 */

	/**
	 *  Stores and maps Tangem card settings
	 * @typedef {string} SettingsMask.
	 */

	/**
	 * Elliptic curve used for wallet key operations.
	 * @typedef {string} EllipticCurve
	 */

	/**
	 * Determines which type of data is required for signing
	 * @typedef {string} SigningMethod
	 */

	/** @typedef {"online"|"offline"} VerificationState */

	/** @typedef {string} Data */

	/**
	 * Index to specific wallet for interaction
	 * @typedef {Object} WalletIndex
	 * @property {number} index Index of wallet
	 * @property {Data} publicKey Wallet public key
	 */

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
	 * @typedef {Object} CardData Detailed information about card contents.
	 * @property {string} [batchId] Tangem internal manufacturing batch ID.
	 * @property {string} [blockchainName] - DEPRECATED: Name of the blockchain.
	 * @property {string} [issuerName] Name of the issuer.
	 * @property {Date} [manufactureDateTime] Timestamp of manufacturing
	 * @property {Data} [manufacturerSignature] Signature of CardId with manufacturer’s private key.
	 * @property {[ProductMask]} [productMask] Mask of products enabled on card.
	 * @property {string} [tokenSymbol] Name of the token
	 * @property {string} [tokenContractAddress] Smart contract address.
	 * @property {number} [tokenDecimal] Number of decimals in token value.
	 */

	/**
	 *
	 * @typedef {Object} ArtworkInfo
	 * @property {string} id
	 * @property {string} hash
	 * @property {string} date
	 */

	/**
	 * Config of Wallet
	 * @typedef {Object} WalletConfig
	 * @property {boolean} [isReusable]
	 * @property {boolean} [prohibitPurgeWallet]
	 * @property {EllipticCurve} [EllipticCurve]
	 * @property {SigningMethod} [signingMethods]
	 */

	/**
	 * @typedef {Object} SimpleResponse
	 * @property {string} cardId Unique Tangem card ID number.
	 */

	/**
	 * @callback SimpleCallback
	 * @param {SimpleResponse} response
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
	 * @property {Number} code
	 * @property {String} localizedDescription
	 */

	/**
	 * @typedef CardWallet
	 * @property {Number} index Index of wallet in card storage. Use this index to create `WalletIndex` for interaction with wallet on card
	 * @property {WalletStatus} status Current status of wallet
	 * @property {EllipticCurve} [curve] Explicit text name of the elliptic curve used for all wallet key operations.
	 * @property {SettingsMask} [settingsMask] settingsMask
	 * @property {Data} [publicKey] Public key of the blockchain wallet.
	 * @property {Number} [signedHashes] Total number of signed single hashes returned by the card in `SignCommand`
	 *  responses since card personalization. Sums up array elements within all `SignCommand`.
	 * @property {Number} [remainingSignatures] Remaining number of `SignCommand` operations before the wallet will stop signing transactions.
	 *  This counter were deprecated for cards with COS 4.0 and higher
	 */

	/**
	 * @typedef {Object} Card Response for `ReadCommand`. Contains detailed card information
	 * @property {string} [cardId] Unique Tangem card ID number.
	 * @property {string} [manufacturerName] Name of Tangem card manufacturer.
	 * @property {CardStatus} [cardStatus] Current status of the card.
	 * @property {FirmwareVersion} firmwareVersion Version of Tangem COS.
	 * @property {Data} [cardPublicKey] Public key that is used to authenticate the card against manufacturer’s database.
	 *  It is generated one time during card manufacturing.
	 * @property {[SettingsMask]} [settingsMask] Card settings defined by personalization (bit mask: 0 – Enabled, 1 – Disabled).
	 * @property {Data} [issuerPublicKey] Public key that is used by the card issuer to sign IssuerData field.
	 * @property {SigningMethod} [signingMethods] Defines what data should be submitted to SIGN command.
	 * @property {number} [pauseBeforePin2] Delay in centiseconds before COS executes commands protected by PIN2. This is a security delay value
	 * @property {number} [health] Any non-zero value indicates that the card experiences some hardware problems.
	 *  User should withdraw the value to other blockchain wallet as soon as possible.
	 *  Non-zero Health tag will also appear in responses of all other commands.
	 * @property {boolean} isActivated Whether the card requires issuer’s confirmation of activation
	 * @property {Data} [activationSeed] A random challenge generated by personalisation that should be signed and returned
	 *  to COS by the issuer to confirm the card has been activated. This field will not be returned if the card is activated
	 * @property {Data} [paymentFlowVersion] Returned only if `SigningMethod.SignPos` enabling POS transactions is supported by card
	 * @property {number} [userCounter] This value can be initialized by terminal and will be increased by COS on execution of every `SignCommand`.
	 *  For example, this field can store blockchain “nonce" for quick one-touch transaction on POS terminals.
	 *  Returned only if `SigningMethod.SignPos`  enabling POS transactions is supported by card.
	 * @property {boolean} terminalIsLinked When this value is true, it means that the application is linked to the card,
	 *  and COS will not enforce security delay if `SignCommand` will be called
	 *  with `TlvTag.TerminalTransactionSignature` parameter containing a correct signature of raw data
	 *  to be signed made with `TlvTag.TerminalPublicKey`.
	 * @property {CardData} [cardData] Detailed information about card contents. Format is defined by the card issuer.
	 *  Cards complaint with Tangem Wallet application should have TLV format.
	 * @property {boolean} [pin2IsDefault] Available only for cards with COS v.4.0 and higher.
	 * @property {number} [walletsCount] Maximum number of wallets that can be created for this card
	 * @property {[CardWallet]} [wallets] Array of the wallets
	 */

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
	 * it obtains the card data. optionsly, if the card contains a wallet (private and public key pair),
	 * it proves that the wallet owns a private key that corresponds to a public one.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {ScanCardCallback} [callback] Callback for command
	 */
	scanCard: function (initialMessage, callback) {
		exec(
			'scanCard',
			{ initialMessage: initialMessage	},
			callback
		);
	},

	/**
	 * The callback for success scan card.
	 * @callback SignCallback
	 * @param {[Data]} [response] Signed hashes (array of resulting signatures)
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
	 * @param {[Data]} hashes Array of transaction hashes. It can be from one or up to ten hashes of the same length.
	 * @param {Data} walletPublicKey  Public key of wallet that should sign hashes.
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SignCallback} [callback] Callback for result
	 */
	sign: function (hashes, walletPublicKey, cardId, initialMessage, callback) {
		exec(
			'sign',
			{
				hashes: hashes,
				walletPublicKey: walletPublicKey,
				cardId: cardId,
				initialMessage: initialMessage
			},
			callback
		);
	},

	/**
	 * @typedef {Object} VerifyResponse
	 * @property {ArtworkInfo} [artworkInfo]
	 * @property {string} cardId Unique Tangem card ID number.
	 * @property {Data} cardPublicKey
	 * @property {Data} cardSignature
	 * @property {Data} salt
	 * @property {VerificationState} [verificationState]
	 */

	/**
	 * Callback triggered on the completion of the `verify` command
	 *  and provides card response in the form of `verifyResponse` if the task was performed successfully
	 * @callback VerifyCallback
	 * @param {VerifyResponse} [response] Response for `Verify` Command
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * This method launches a `Verify` card command on a new thread.
	 *
	 * The command to ensures the card has not been counterfeited.
	 * By using standard challenge-response scheme, the card proves possession of CardPrivateKey
	 * that corresponds to CardPublicKey returned by [ReadCommand]. Then the data is sent
	 * to Tangem server to prove that  this card was indeed issued by Tangem.
	 * The online part of the verification is unavailable for DevKit cards.
	 * @param {boolean} online flag that allows disable online verification. Do not use for developer cards
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {VerifyCallback} [callback] Callback triggered on the completion of the VerifyCardCommand
	 *  and provides card response in the form of [VerifyCardResponse] if the task was performed successfully
	 */
	verify: function (online, cardId, initialMessage, callback) {
		exec(
			'verify',
			{ online: online, cardId: cardId, initialMessage: initialMessage },
			callback
		);
	},

	/**
	 * @typedef {Object} ReadIssuerDataResponse
	 * @property {string} cardId Unique Tangem card ID number.
	 * @property {Data} userData Data defined by user's App.
	 * @property {Data} userProtectedData Counter initialized by user's App and increased on every signing of new transaction
	 * @property {number} userCounter Counter initialized by user's App and increased on every signing of new transaction
	 * @property {number} userProtectedCounter Counter initialized by user's App (confirmed by PIN2) and increased on every signing of new transaction
	 */

	/**
	 * @callback ReadIssuerDataCallback
	 * @param {ReadIssuerDataResponse} [response]
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * This command return 512-byte Issuer Data field and its issuer’s signature.
	 * Issuer Data is never changed or parsed from within the Tangem COS. The issuer defines purpose of use,
	 * format and payload of Issuer Data. For example, this field may contain information about
	 * wallet balance signed by the issuer or additional issuer’s attestation data.
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {ReadIssuerDataCallback} [callback] Callback for result
	 */
	readIssuerData: function (cardId, initialMessage, callback) {
		exec(
			'readIssuerData',
			{ cardId: cardId, initialMessage: initialMessage },
			callback
		);
	},

	/**
	 * This command writes some UserData, and UserCounter fields.
	 * User_Data are never changed or parsed by the executable code the Tangem COS.
	 * The App defines purpose of use, format and it's payload. For example, this field may contain cashed information
	 * from blockchain to accelerate preparing new transaction.
	 * User_Counter are counter, that initial value can be set by App and increased on every signing
	 * of new transaction (on SIGN command that calculate new signatures). The App defines purpose of use.
	 * For example, this fields may contain blockchain nonce value.
	 * @param {Data} issuerData Data defined by user’s App
	 * @param {Data} issuerDataSignature Issuer’s signature of `issuerData` with Issuer Data Private Key (which is kept on card).
	 * @param {number} [issuerDataCounter] Counter initialized by user’s App and increased on every signing of new transaction.
	 *  If nil, the current counter value will not be overwritten.
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SimpleCallback} [callback] Callback for result
	 */
	writeIssuerData: function (issuerData,  issuerDataSignature,issuerDataCounter, cardId, initialMessage, callback) {
		exec(
			'writeIssuerData',
			{
				issuerData: issuerData,
				issuerDataSignature: issuerDataSignature,
				issuerDataCounter: issuerDataCounter,
				cardId: cardId,
				initialMessage: initialMessage
			},
			callback
		);
	},

	/**
	 * @typedef {Object} ReadIssuerExtraDataResponse
	 * @property {string} cardId Unique Tangem card ID number.
	 * @property {number} [size] Size of all Issuer_Extra_Data field.
	 * @property {Data} [issuerData] Data defined by issuer.
	 */

	/**
	 * @callback ReadIssuerExtraDataCallback
	 * @param {ReadIssuerExtraDataResponse} [response]
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * This task retrieves Issuer Extra Data field and its issuer’s signature.
	 * Issuer Extra Data is never changed or parsed from within the Tangem COS. The issuer defines purpose of use,
	 * format and payload of Issuer Data. . For example, this field may contain photo or
	 * biometric information for ID card product. Because of the large size of Issuer_Extra_Data,
	 * a series of these commands have to be executed to read the entire Issuer_Extra_Data.
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {ReadIssuerExtraDataCallback} [callback] Callback for result
	 */
	readIssuerExtraData: function (cardId, initialMessage, callback) {
		exec(
			'readIssuerExtraData',
			{
				cardId: cardId,
				initialMessage: initialMessage
			},
			callback
		);
	},

	/**
	 * This task writes Issuer Extra Data field and its issuer’s signature.
	 * Issuer Extra Data is never changed or parsed from within the Tangem COS.
	 * The issuer defines purpose of use, format and payload of Issuer Data.
	 * For example, this field may contain a photo or biometric information for ID card products.
	 * Because of the large size of Issuer_Extra_Data, a series of these commands have to be executed
	 * to write entire Issuer_Extra_Data.
	 * @param {Data} issuerData Data provided by issuer.
	 * @param {Data} startingSignature Issuer’s signature with Issuer Data Private Key of `cardId`,
	 * `issuerDataCounter` (if flags Protect_Issuer_Data_Against_Replay and
	 * Restrict_Overwrite_Issuer_Extra_Data are set in `SettingsMask`) and size of `issuerData`.
	 * @param {Data} finalizingSignature Issuer’s signature with Issuer Data Private Key of `cardId`,
	 * `issuerData` and `issuerDataCounter` (the latter one only if flags Protect_Issuer_Data_Against_Replay
	 * and Restrict_Overwrite_Issuer_Extra_Data are set in `SettingsMask`).
	 * @param {number} [issuerDataCounter] An optional counter that protect issuer data against replay attack.
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SimpleCallback} [callback] Callback for result
	 */
	writeIssuerExtraData: function (issuerData, startingSignature, finalizingSignature, issuerDataCounter, cardId, initialMessage, callback) {
		exec(
			'writeIssuerExtraData',
			{
				issuerData: issuerData,
				startingSignature: startingSignature,
				finalizingSignature: finalizingSignature,
				issuerDataCounter: issuerDataCounter,
				cardId: cardId,
				initialMessage: initialMessage
			},
			callback
		);
	},

	/**
	 * @typedef {Object} ReadUserDataResponse
	 * @property {string} cardId Unique Tangem card ID number.
	 * @property {Data} userData Data defined by user's App.
	 * @property {Data} userProtectedData Counter initialized by user's App and increased on every signing of new transaction
	 * @property {number} userCounter Counter initialized by user's App and increased on every signing of new transaction
	 * @property {number} userProtectedCounter Counter initialized by user's App (confirmed by PIN2) and increased on every signing of new transaction
	 */

	/**
	 * @callback ReadUserDataCallback
	 * @param {ReadUserDataResponse} [response]
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * This command return two up to 512-byte User_Data, User_Protected_Data and two counters User_Counter and
	 * User_Protected_Counter fields.
	 * User_Data and User_ProtectedData are never changed or parsed by the executable code the Tangem COS.
	 * The App defines purpose of use, format and it's payload. For example, this field may contain cashed information
	 * from blockchain to accelerate preparing new transaction.
	 * User_Counter and User_ProtectedCounter are counters, that initial values can be set by App and increased on every signing
	 * of new transaction (on SIGN command that calculate new signatures). The App defines purpose of use.
	 * For example, this fields may contain blockchain nonce value.
	 *
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {ReadUserDataCallback} [callback] Callback for result
	 */
	readUserData: function (cardId, initialMessage, callback) {
		exec(
			'readUserData',
			{ cardId: cardId, initialMessage: initialMessage },
			callback
		);
	},

	/**
	 * This command writes some UserData, and UserCounter fields.
	 * User_Data are never changed or parsed by the executable code the Tangem COS.
	 * The App defines purpose of use, format and it's payload. For example, this field may contain cashed information
	 * from blockchain to accelerate preparing new transaction.
	 * User_Counter are counter, that initial value can be set by App and increased on every signing
	 * of new transaction (on SIGN command that calculate new signatures). The App defines purpose of use.
	 * For example, this fields may contain blockchain nonce value.
	 * Writing of UserCounter and UserData is protected only by PIN1.
	 *
	 * @param {Data} userData  Data defined by user’s App
	 * @param {number} userCounter: Counter initialized by user’s App and increased on every signing of new transaction.
	 *  If nil, the current counter value will not be overwritten.
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SimpleCallback} [callback] Callback for result
	 */
	writeUserData: function (userData, userCounter, cardId, initialMessage, callback) {
		exec(
			'writeUserData',
			{
				userData: userData,
				userCounter: userCounter,
				cardId: cardId,
				initialMessage: initialMessage
			},
			callback
		);
	},

	/**
	 * This command writes some UserProtectedData and UserProtectedCounter fields.
	 * User_ProtectedData are never changed or parsed by the executable code the Tangem COS.
	 * The App defines purpose of use, format and it's payload. For example, this field may contain cashed information
	 * from blockchain to accelerate preparing new transaction.
	 * User_ProtectedCounter are counter, that initial value can be set by App and increased on every signing
	 * of new transaction (on SIGN command that calculate new signatures). The App defines purpose of use.
	 * For example, this fields may contain blockchain nonce value.
	 *
	 * UserProtectedCounter and UserProtectedData is protected by PIN1 and need additionally PIN2 to confirmation.
	 *
	 * @param {Data} userProtectedData Data defined by user’s App (confirmed by PIN2)
	 * @param {number} userProtectedCounter Counter initialized by user’s App (confirmed by PIN2) and increased on every signing of new transaction.
	 *  If nil, the current counter value will not be overwritten.
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SimpleCallback} [callback] Callback for result
	 */
	writeUserProtectedData: function (userProtectedData, userProtectedCounter, cardId, initialMessage, callback) {
		exec(
			'writeUserProtectedData',
			{
				userProtectedData: userProtectedData,
				userProtectedCounter: userProtectedCounter,
				cardId: cardId,
				initialMessage: initialMessage
			},
			callback
		);
	},

	/**
	 * @typedef {Object} CreateWalletResponse
	 * @property {string} cardId Unique Tangem card ID number.
	 * @property {CardStatus} status Current status of the card [1 - Empty, 2 - Loaded, 3- Purged]
	 * @property {number} walletIndex Wallet index on card.
	 *  - Note: Available only for cards with COS v.4.0 and higher
	 * @property {Data} walletPublicKey Public key of a newly created blockchain wallet.
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
	 * @param {WalletConfig} [config] Configuration for wallet that should be created (blockchain name, token...).
	 *  This parameter available for cards with COS v.4.0 and higher. For earlier versions it will be ignored
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {CreateWalletCallback} [callback] Callback for result
	 */
	createWallet: function (config, cardId, initialMessage, callback) {
		exec(
			'createWallet',
			{ config: config, cardId: cardId, initialMessage: initialMessage	},
			callback
		);
	},

	/**
	 * @typedef {Object} PurgeWalletResponse
	 * @property {string} cardId Unique Tangem card ID number.
	 * @property {CardStatus} status Current status of the card [1 - Empty, 2 - Loaded, 3- Purged]
	 * @property {number} walletIndex Index of purged wallet
	 */

	/**
	 * @callback PurgeWalletCallback
	 * @param {PurgeWalletResponse} [response]
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * This command deletes all wallet data. If Is_Reusable flag is enabled during personalization,
	 * the card changes state to ‘Empty’ and a new wallet can be created by `CREATE_WALLET` command.
	 * If Is_Reusable flag is disabled, the card switches to ‘Purged’ state.
	 * ‘Purged’ state is final, it makes the card useless.
	 * - Note: Wallet index available for cards with COS v.4.0 or higher
	 * @param {Data} walletPublicKey Public key of wallet that should be purged.
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {PurgeWalletCallback} [callback] Callback for result
	 */
	purgeWallet: function (walletPublicKey, cardId, initialMessage, callback) {
		exec(
			'purgeWallet',
			{ walletPublicKey: walletPublicKey, cardId: cardId, initialMessage: initialMessage	},
			callback
		);
	},

	/**
	 * @typedef {Object} ChangePinResponse
	 * @property {string} cardId Unique Tangem card ID number.
	 * @property {string} status status
	 */

	/**
	 * @callback ChangePinCallback
	 * @param {ChangePinResponse} [response]
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * Command for change pin1
	 * @param {Data} pin Pin data
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {ChangePinCallback} [callback] Callback for result
	 */
	changePin1: function (pin, cardId, initialMessage, callback) {
		exec(
			'changePin1',
			{ pin: pin, cardId: cardId, initialMessage: initialMessage	},
			callback
		)
	},

	/**
	 * Command for change pin2
	 * @param {Data} pin Pin data
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {ChangePinCallback} [callback] Callback for result
	 */
	changePin2: function (pin, cardId, initialMessage, callback) {
		exec(
			'changePin2',
			{ pin: pin, cardId: cardId, initialMessage: initialMessage	},
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
	 * @property {number} fileIndex
	 * @property {Data} fileData
	 * @property {FileSettings} [fileSettings]
	 * @property {FileValidation} fileValidationStatus
	 */

	/**
	 * @typedef {Object} ReadFilesResponse
	 * @property {[File]} files
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
	 * - Note: When performing reading private files command, you must  provide `pin2`
	 * - Warning: Command available only for cards with COS 3.29 and higher
	 *
	 * @param {boolean} readPrivateFiles If true - all files saved on card will be read otherwise
	 * @param {[number]} [indices] Indices of files that should be read from card. If not specifies all files will be read.
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {ReadFilesCallback} [callback] Callback for result
	 */
	readFiles: function (readPrivateFiles, indices, cardId, initialMessage, callback) {
		exec(
			'readFiles',
			{ readPrivateFiles: readPrivateFiles, indices: indices, 	cardId: cardId,	initialMessage: initialMessage },
			callback
		);
	},

	/**
	 * @typedef {Object} Response
	 */

	/**
	 * @callback Callback
	 * @param {Response} [response]
	 * @param {TangemSdkError} [error] Error
	 * @return {void}
	 */

	/**
	 * This command write all files provided in `files` to card.
	 *
	 * There are 2 main implementation of `DataToWrite` protocol:
	 * - `FileDataProtectedBySignature` - for files  signed by Issuer (specified on card during personalization)
	 * - `FileDataProtectedByPasscode` - write files protected by Pin2
	 *
	 * Warning: This command available for COS 3.29 and higher
	 * Note: Writing files protected by Pin2 only available for COS 3.34 and higher
	 * @param {[File]} files List of files that should be written to card
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {ReadFilesCallback} [callback] Callback for result
	 */
	writeFiles: function (files, cardId, initialMessage, callback) {
		exec(
			'writeFiles',
			{ files: files, cardId: cardId, initialMessage: initialMessage },
			callback
		);
	},

	/**
	 * This command deletes selected files from card. This operation can't be undone.
	 *
	 * To perform file deletion you should initially read all files (`readFiles` command) and add them to `indices` array. When files deleted from card, other files change their indexes.
	 * After deleting files you should additionally perform `readFiles` command to actualize files indexes
	 * Warning: This command available for COS 3.29 and higher
	 * @param {[number]} [indicesToDelete] Indexes of files that should be deleted. If nil - deletes all files from card
	 * @param {string} [cardId] Unique Tangem card ID number.
	 * @param {Message} [initialMessage] A custom description that shows at the beginning of the NFC session. If nil, default message will be used
	 * @param {SimpleCallback} [callback] Callback for result
	 */
	deleteFiles: function (indicesToDelete, cardId, initialMessage, callback) {
		exec(
			'deleteFiles',
			{ indicesToDelete: indicesToDelete, cardId: cardId, initialMessage: initialMessage	},
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
	 * @param {SimpleCallback} [callback] Callback for result
	 */
	changeFilesSettings: function (changes, cardId, initialMessage, callback) {
		exec(
			'changeFilesSettings',
			{ changes: changes, cardId: cardId, initialMessage: initialMessage },
			callback
		)

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
	Object.keys(options).forEach(function (key) {
		if (typeof options[key] === 'undefined') {
			delete options[key];
		}
		if (typeof options[key] === 'object') {
			options[key] = JSON.stringify(options[key]);
		}
	});
	cordovaExec(
		function (result) {
			console.log(typeof result);
			callback && callback(JSON.parse(result));
		},
		function (error) {
			callback && callback(undefined, JSON.parse(error));
		},
		'TangemSdkPlugin',
		command,
		[options]
	);
}

module.exports = TangemSdk;
package tangem_sdk;

import android.app.Activity;
import android.content.Context;
import com.squareup.sqldelight.android.AndroidSqliteDriver;
import com.squareup.sqldelight.db.SqlDriver;
import com.tangem.*;
import com.tangem.common.CardValuesDbStorage;
import com.tangem.common.CardValuesStorage;
import com.tangem.common.CompletionResult;
import com.tangem.tangem_sdk_new.DefaultSessionViewDelegate;
import com.tangem.tangem_sdk_new.TerminalKeysStorage;
import com.tangem.tangem_sdk_new.extensions.TangemSdkErrorKt;
import com.tangem.tangem_sdk_new.nfc.NfcManager;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.WeakReference;

import static tangem_sdk.FieldParser.*;

/**
 * This class echoes a string called from JavaScript.
 */
public class TangemSdkPlugin extends CordovaPlugin {

    private TangemSdk sdk;
    private NfcManager nfcManager;
    private WeakReference<Context> wActivityContext;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        wActivityContext = new WeakReference<>(cordova.getContext());
        Activity activity = cordova.getActivity();
        nfcManager = new NfcManager();
        nfcManager.setCurrentActivity(activity);

        DefaultSessionViewDelegate viewDelegate = new DefaultSessionViewDelegate(nfcManager, nfcManager.getReader());
        viewDelegate.activity = activity;

        Config config = new Config();
        config.setLinkedTerminal(false);

        SqlDriver driver = new AndroidSqliteDriver(
                Database.Companion.getSchema(),
                activity.getApplicationContext(),
                "cordova_cards.db"
        );
        CardValuesStorage valueStorage = new CardValuesDbStorage(driver);
        sdk = new TangemSdk(
                nfcManager.getReader(),
                viewDelegate,
                config,
                valueStorage,
                new TerminalKeysStorage(activity.getApplication())
        );
        nfcManager.onStart();
    }

    @Override
    public void onStart() {
        super.onStart();
        if (nfcManager != null) nfcManager.onStart();
    }

    @Override
    public void onStop() {
        super.onStop();
        if (nfcManager != null) nfcManager.onStop();
    }

    @Override
    public void onDestroy() {
        if (nfcManager != null) nfcManager.onDestroy();
        super.onDestroy();
    }

    @Override
    public boolean execute(String action, String rawArgs, CallbackContext callbackContext) throws JSONException {
        return super.execute(action, rawArgs, callbackContext);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
            case "scanCard": {
                scanCard(callbackContext, args);
                return true;
            }
            case "sign": {
                sign(callbackContext, args);
                return true;
            }
            case "verify": {
                verify(callbackContext, args);
                return true;
            }
            case "readIssuerData": {
                readIssuerData(callbackContext, args);
                return true;
            }
            case "writeIssuerData": {
                writeIssuerData(callbackContext, args);
                return true;
            }
            case "readIssuerExtraData": {
                readIssuerExtraData(callbackContext, args);
                return true;
            }
            case "writeIssuerExtraData": {
                writeIssuerExtraData(callbackContext, args);
                return true;
            }
            case "readUserData": {
                readUserData(callbackContext, args);
                return true;
            }
            case "writeUserData": {
                writeUserData(callbackContext, args);
                return true;
            }
            case "writeUserProtectedData": {
                writeUserProtectedData(callbackContext, args);
                return true;
            }
            case "createWallet": {
                createWallet(callbackContext, args);
                return true;
            }
            case "purgeWallet": {
                purgeWallet(callbackContext, args);
                return true;
            }
            case "changePin1": {
                changePin1(callbackContext, args);
                return true;
            }
            case "changePin2": {
                changePin2(callbackContext, args);
                return true;
            }
            case "readFiles": {
                readFiles(callbackContext, args);
                return true;
            }
            case "writeFiles": {
                writeFiles(callbackContext, args);
                return true;
            }
            case "deleteFiles": {
                deleteFiles(callbackContext, args);
                return true;
            }
            case "changeFilesSettings": {
                changeFilesSettings(callbackContext, args);
                return true;
            }
        }
        return false;
    }

    private void scanCard(final CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.scanCard(
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void sign(final CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.sign(
                    hashes(jsO),
                    walletPublicKey(jsO),
                    cardId(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void verify(final CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.verify(
                    online(jsO),
                    cardId(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });

        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void readIssuerData(final CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.readIssuerData(
                    cardId(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void writeIssuerData(final CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.writeIssuerData(
                    cardId(jsO),
                    issuerData(jsO),
                    issuerDataSignatures(jsO),
                    issuerDataCounter(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void readIssuerExtraData(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.readIssuerExtraData(
                    cardId(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void writeIssuerExtraData(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.writeIssuerExtraData(
                    cardId(jsO),
                    issuerData(jsO),
                    startingSignature(jsO),
                    finalizingSignature(jsO),
                    issuerDataCounter(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void readUserData(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.readUserData(
                    cardId(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void writeUserData(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.writeUserData(
                    cardId(jsO),
                    userData(jsO),
                    userCounter(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void writeUserProtectedData(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.writeUserProtectedData(
                    cardId(jsO),
                    userProtectedData(jsO),
                    userProtectedCounter(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void createWallet(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.createWallet(
                    walletConfig(jsO),
                    cardId(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void purgeWallet(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.purgeWallet(
                    walletIndexFromPublicKey(jsO),
                    cardId(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void changePin1(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.changePin1(
                    cardId(jsO),
                    pinCode(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void changePin2(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.changePin2(
                    cardId(jsO),
                    pinCode(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void readFiles(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.readFiles(
                    ((boolean) jsO.optBoolean("readPrivateFiles")),
                    indices(jsO),
                    cardId(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void writeFiles(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.writeFiles(
                    files(jsO),
                    cardId(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void deleteFiles(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.deleteFiles(
                    indices(jsO),
                    cardId(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void changeFilesSettings(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.changeFilesSettings(
                    changes(jsO),
                    cardId(jsO),
                    initialMessage(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(prettyPrint(createExceptionError(ex)));
        }
    }

    private void handleResult(CallbackContext callbackContext, CompletionResult completionResult) {
        if (completionResult instanceof CompletionResult.Success) {
            CompletionResult.Success cardResult = (CompletionResult.Success) completionResult;
            callbackContext.success(prettyPrint(cardResult.getData()));
        } else if (completionResult instanceof CompletionResult.Failure) {
            CompletionResult.Failure failure = (CompletionResult.Failure) completionResult;
            callbackContext.error(prettyPrint(createTangemSdkError(failure.getError())));
        }
    }

    private PluginError createExceptionError(Exception ex) {
        return new PluginError(9999, ex.toString());
    }

    private PluginError createTangemSdkError(TangemError error) {
        int code = error.getCode();
        Context context = wActivityContext.get();
        if (context == null) return new PluginError(code, Integer.toString(code));

        if (error instanceof TangemSdkError) {
            TangemSdkError sdkError = ((TangemSdkError) error);
            String message = TangemSdkErrorKt.localizedDescription(sdkError, context);
            return new PluginError(code, message);
        } else {
            return new PluginError(code, error.getCustomMessage());
        }
    }

    private static class PluginError {
        public int code;
        public String localizedDescription;

        public PluginError(int code, String localizedDescription) {
            this.code = code;
            this.localizedDescription = localizedDescription;
        }
    }
}
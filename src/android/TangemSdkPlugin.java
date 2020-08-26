package tangem_sdk;

import android.app.Activity;
import android.content.Context;
import androidx.annotation.Nullable;
import com.squareup.sqldelight.android.AndroidSqliteDriver;
import com.squareup.sqldelight.db.SqlDriver;
import com.tangem.*;
import com.tangem.commands.common.ResponseConverter;
import com.tangem.common.CardValuesDbStorage;
import com.tangem.common.CardValuesStorage;
import com.tangem.common.CompletionResult;
import com.tangem.common.extensions.StringKt;
import com.tangem.tangem_sdk_new.DefaultSessionViewDelegate;
import com.tangem.tangem_sdk_new.TerminalKeysStorage;
import com.tangem.tangem_sdk_new.extensions.TangemSdkErrorKt;
import com.tangem.tangem_sdk_new.nfc.NfcManager;
import kotlin.text.StringsKt;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.WeakReference;

/**
 * This class echoes a string called from JavaScript.
 */
public class TangemSdkPlugin extends CordovaPlugin {

    private TangemSdk sdk;
    private NfcManager nfcManager;
    private ResponseConverter converter;
    private WeakReference<Context> wActivityContext;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        this.converter = new ResponseConverter();

        wActivityContext = new WeakReference<>(cordova.getContext());
        Activity activity = cordova.getActivity();
        nfcManager = new NfcManager();
        nfcManager.setCurrentActivity(activity);

        DefaultSessionViewDelegate viewDelegate = new DefaultSessionViewDelegate(nfcManager.getReader());
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
        nfcManager.onResume();
    }

    @Override
    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
        if (nfcManager != null) nfcManager.onResume();
    }

    @Override
    public void onPause(boolean multitasking) {
        if (nfcManager != null) nfcManager.onPause();
        super.onPause(multitasking);
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
        }
        return false;
    }

    private void scanCard(final CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.scanCard(
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void sign(final CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.sign(
                    FieldParser.hashes(jsO),
                    FieldParser.cid(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void verify(final CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.verify(
                    FieldParser.cid(jsO),
                    FieldParser.online(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });

        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void readIssuerData(final CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.readIssuerData(
                    FieldParser.cid(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void writeIssuerData(final CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.writeIssuerData(
                    FieldParser.cid(jsO),
                    FieldParser.issuerData(jsO),
                    FieldParser.issuerDataSignatures(jsO),
                    FieldParser.issuerDataCounter(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void readIssuerExtraData(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.readIssuerExtraData(
                    FieldParser.cid(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void writeIssuerExtraData(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.writeIssuerExtraData(
                    FieldParser.cid(jsO),
                    FieldParser.issuerData(jsO),
                    FieldParser.startingSignature(jsO),
                    FieldParser.finalizingSignature(jsO),
                    FieldParser.issuerDataCounter(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void readUserData(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.readUserData(
                    FieldParser.cid(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void writeUserData(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.writeUserData(
                    FieldParser.cid(jsO),
                    FieldParser.userData(jsO),
                    FieldParser.userCounter(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void writeUserProtectedData(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.writeUserProtectedData(
                    FieldParser.cid(jsO),
                    FieldParser.userProtectedData(jsO),
                    FieldParser.userProtectedCounter(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void createWallet(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.createWallet(
                    FieldParser.cid(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void purgeWallet(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.purgeWallet(
                    FieldParser.cid(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void changePin1(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.changePin1(
                    FieldParser.cid(jsO),
                    FieldParser.pinCode(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void changePin2(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.changePin2(
                    FieldParser.cid(jsO),
                    FieldParser.pinCode(jsO),
                    FieldParser.message(jsO),
                    completionResult -> {
                        handleResult(callbackContext, completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            callbackContext.error(converter.getGson().toJson(createExceptionError(ex)));
        }
    }

    private void handleResult(CallbackContext callbackContext, CompletionResult completionResult) {
        if (completionResult instanceof CompletionResult.Success) {
            CompletionResult.Success cardResult = (CompletionResult.Success) completionResult;
            callbackContext.success(converter.getGson().toJson(cardResult.getData()));
        } else if (completionResult instanceof CompletionResult.Failure) {
            CompletionResult.Failure failure = (CompletionResult.Failure) completionResult;
            callbackContext.error(converter.getGson().toJson(createTangemSdkError(failure.getError())));
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
            return new PluginError(code, context.getString(TangemSdkErrorKt.localizedDescription(sdkError)));
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

    private static class FieldParser {

        public static Message message(JSONObject jsO) throws JSONException {
            if (!jsO.has("initialMessage")) return null;

            Object objMessage = jsO.opt("initialMessage");
            if (objMessage == null || !(objMessage instanceof JSONObject)) return null;

            JSONObject jsMessage = ((JSONObject) objMessage);

            String header = jsMessage.getString("header");
            String body = jsMessage.getString("body");
            return new Message(header, body);
        }

        public static String cid(JSONObject jsO) throws JSONException {
            return ((String) jsO.get("cid"));
        }

        public static Boolean online(JSONObject jsO) throws JSONException {
            return ((Boolean) jsO.getBoolean("online"));
        }

        public static byte[] pinCode(JSONObject jsO) {
            Object pinRaw = jsO.opt("pinCode");
            if (pinRaw == null || !(pinRaw instanceof String)) return  null;

            return StringKt.calculateSha256(((String) pinRaw));
        }

        public static byte[][] hashes(JSONObject jsO) throws JSONException {
            JSONArray array = ((JSONArray) jsO.get("hashes"));

            byte[][] listOfBytes = new byte[array.length()][];
            for (int i = 0; i < array.length(); i++) {
                listOfBytes[i] = hexToBytes((String) array.get(i));
            }
            //listOfBytes[0] = hexToBytes(ByteArrayKt.toHexString("Data used for hashing".getBytes()));
            //listOfBytes[1] = hexToBytes(ByteArrayKt.toHexString("Data used for hashing".getBytes()));
            return listOfBytes;
        }

        public static byte[] issuerData(JSONObject jsO) throws JSONException {
            return fetchHexStringAndConvertToBytes(jsO, "issuerData");
        }

        public static byte[] issuerDataSignatures(JSONObject jsO) throws JSONException {
            return fetchHexStringAndConvertToBytes(jsO, "issuerDataSignature");
        }

        public static byte[] startingSignature(JSONObject jsO) throws JSONException {
            return fetchHexStringAndConvertToBytes(jsO, "startingSignature");
        }

        public static byte[] finalizingSignature(JSONObject jsO) throws JSONException {
            return fetchHexStringAndConvertToBytes(jsO, "finalizingSignature");
        }

        @Nullable
        public static Integer issuerDataCounter(JSONObject jsO) throws JSONException {
            return jsO.has("issuerDataCounter") ? jsO.getInt("issuerDataCounter") : null;
        }

        public static byte[] userData(JSONObject jsO) throws JSONException {
            return fetchHexStringAndConvertToBytes(jsO, "userData");
        }

        public static byte[] userProtectedData(JSONObject jsO) throws JSONException {
            return fetchHexStringAndConvertToBytes(jsO, "userProtectedData");
        }

        @Nullable
        public static Integer userCounter(JSONObject jsO) throws JSONException {
            return jsO.has("userCounter") ? jsO.getInt("userCounter") : null;
        }

        @Nullable
        public static Integer userProtectedCounter(JSONObject jsO) throws JSONException {
            return jsO.has("userProtectedCounter") ? jsO.getInt("userProtectedCounter") : null;
        }

        private static byte[] fetchHexStringAndConvertToBytes(JSONObject jsO, String name) throws JSONException {
            String hexString = jsO.getString(name);
            return hexToBytes(hexString);
        }

        private static byte[] hexToBytes(String hexString) {
            return StringKt.hexToBytes(hexString);
        }
    }
}
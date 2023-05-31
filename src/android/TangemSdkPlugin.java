package tangem_sdk;

import android.os.Handler;
import android.util.Base64;

import androidx.appcompat.app.AppCompatActivity;

import com.tangem.TangemSdk;
import com.tangem.common.biometric.BiometricManager;
import com.tangem.common.core.Config;
import com.tangem.common.core.ScanTagImage;
import com.tangem.common.json.MoshiJsonConverter;
import com.tangem.common.services.secure.SecureStorage;
import com.tangem.crypto.bip39.Wordlist;
import com.tangem.sdk.DefaultSessionViewDelegate;
import com.tangem.sdk.extensions.TangemSdkKt;
import com.tangem.sdk.extensions.WordlistKt;
import com.tangem.sdk.nfc.NfcManager;
import com.tangem.sdk.storage.AndroidSecureStorageKt;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * This class echoes a string called from JavaScript.
 */
public class TangemSdkPlugin extends CordovaPlugin {

    private TangemSdk sdk;
    private NfcManager nfcManager;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        AppCompatActivity activity = cordova.getActivity();
        Handler handler = new Handler(activity.getMainLooper());
        handler.post(() -> {
            nfcManager = new NfcManager();
            nfcManager.setCurrentActivity(activity);

            DefaultSessionViewDelegate viewDelegate = new DefaultSessionViewDelegate(nfcManager, nfcManager.getReader(), activity);

            SecureStorage storage = AndroidSecureStorageKt.create(SecureStorage.Companion, activity);
            Config config = new Config();

            BiometricManager biometricManager = TangemSdkKt.initBiometricManager(TangemSdk.Companion, activity, storage);
            Wordlist wordlist = WordlistKt.getWordlist(Wordlist.Companion, activity);

            sdk = new TangemSdk(nfcManager.getReader(), viewDelegate, storage, biometricManager, wordlist, config);
            nfcManager.onStart();
        });
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
            case "runJSONRPCRequest": {
                runJSONRPCRequest(callbackContext, args);
                return true;
            }
            case "setScanImage": {
                setScanImage(callbackContext, args);
            }
        }
        return false;
    }

    private void runJSONRPCRequest(CallbackContext callbackContext, JSONArray args) {
        try {
            JSONObject jsO = (JSONObject) args.get(0);
            sdk.startSessionWithJsonRequest(
                    jsO.getString("JSONRPCRequest"),
                    jsO.optString("cardId", null),
                    jsO.optString("initialMessage", null),
                    jsO.optString("accessCode", null),
                    completionResult -> {
                        callbackContext.success(completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            MoshiJsonConverter converter = MoshiJsonConverter.Companion.getINSTANCE();
            callbackContext.error(converter.prettyPrint(ex, "  "));
        }
    }

    private void setScanImage(CallbackContext callbackContext, JSONArray args) {
        try {
            if (args.length() == 0 || args.get(0) == null) {
                sdk.setScanImage(ScanTagImage.GenericCard.INSTANCE);
                callbackContext.success();
            } else {
                JSONObject jsO = (JSONObject) args.get(0);
                String base64String = jsO.getString("base64");
                int verticalOffset = jsO.optInt("verticalOffset", 0);

                byte[] base64Image = Base64.decode(base64String, Base64.DEFAULT);
                ScanTagImage scanTagImage = new ScanTagImage.Image(base64Image, verticalOffset);
                sdk.setScanImage(scanTagImage);
                callbackContext.success();
            }
        } catch (Exception ex) {
            MoshiJsonConverter converter = MoshiJsonConverter.Companion.getINSTANCE();
            callbackContext.error(converter.prettyPrint(ex, "  "));
        }
    }
}
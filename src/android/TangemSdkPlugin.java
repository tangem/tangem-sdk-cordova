package tangem_sdk;

import android.app.Activity;
import com.tangem.TangemSdk;
import com.tangem.common.core.Config;
import com.tangem.common.json.MoshiJsonConverter;
import com.tangem.common.services.secure.SecureStorage;
import com.tangem.tangem_sdk_new.DefaultSessionViewDelegate;
import com.tangem.tangem_sdk_new.nfc.NfcManager;
import com.tangem.tangem_sdk_new.storage.AndroidSecureStorageKt;
import org.apache.cordova.*;
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

        Activity activity = cordova.getActivity();
        nfcManager = new NfcManager();
        nfcManager.setCurrentActivity(activity);

        DefaultSessionViewDelegate viewDelegate = new DefaultSessionViewDelegate(nfcManager, nfcManager.getReader());
        viewDelegate.activity = activity;

        SecureStorage storage = AndroidSecureStorageKt.create(SecureStorage.Companion, activity);
        Config config = new Config();

        sdk = new TangemSdk(nfcManager.getReader(), viewDelegate, storage, config);
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
            case "runJSONRPCRequest": {
                runJSONRPCRequest(callbackContext, args);
                return true;
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
                    completionResult -> {
                        callbackContext.success(completionResult);
                        return null;
                    });
        } catch (Exception ex) {
            MoshiJsonConverter converter = MoshiJsonConverter.Companion.getINSTANCE();
            callbackContext.error(converter.prettyPrint(ex, "  "));
        }
    }
}
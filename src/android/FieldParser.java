package tangem_sdk;

import androidx.annotation.Nullable;

import com.tangem.Message;
import com.tangem.commands.common.card.EllipticCurve;
import com.tangem.commands.common.card.masks.SigningMethod;
import com.tangem.commands.file.FileData;
import com.tangem.commands.file.FileDataSignature;
import com.tangem.commands.file.FileSettings;
import com.tangem.commands.file.FileSettingsChange;
import com.tangem.commands.wallet.WalletConfig;
import com.tangem.commands.wallet.WalletIndex;
import com.tangem.common.extensions.StringKt;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

class FieldParser {

    @Nullable
    public static Message initialMessage(JSONObject jsO) throws JSONException {
        if (!jsO.has("initialMessage")) return null;

        Object objMessage = jsO.opt("initialMessage");
        if (objMessage == null || !(objMessage instanceof JSONObject)) return null;

        JSONObject jsMessage = ((JSONObject) objMessage);

        String header = jsMessage.getString("header");
        String body = jsMessage.getString("body");
        return new Message(header, body);
    }

    @Nullable
    public static String cardId(JSONObject jsO) throws JSONException {
        if (jsO.isNull("cardId")) return null;
        return ((String) jsO.get("cardId"));
    }

    public static Boolean onlineVerify(JSONObject jsO) throws JSONException {
        return ((Boolean) jsO.getBoolean("onlineVerify"));
    }

    @Nullable
    public static byte[] pinCode(JSONObject jsO) {
        Object pinRaw = jsO.opt("pinCode");
        if (pinRaw == null || !(pinRaw instanceof String)) return null;

        return StringKt.calculateSha256(((String) pinRaw));
    }

    public static byte[][] hashes(JSONObject jsO) throws JSONException {
        JSONArray array = ((JSONArray) jsO.get("hashes"));

        byte[][] listOfBytes = new byte[array.length()][];
        for (int i = 0; i < array.length(); i++) {
            listOfBytes[i] = hexToBytes((String) array.get(i));
        }
        return listOfBytes;
    }

    public static byte[] walletPublicKey(JSONObject jsO) throws JSONException {
        return fetchHexStringAndConvertToBytes(jsO, "walletPublicKey");
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

    @Nullable
    public static List<Integer> indices(JSONObject jsO) throws JSONException {
        if (jsO.isNull("indices")) return null;

        JSONArray jsonArray = jsO.getJSONArray("indices");
        List<Integer> list = new ArrayList();
        int len = jsonArray.length();
        for (int i = 0; i < len; i++) {
            Object item = jsonArray.get(i);
            if (item instanceof Integer) list.add(((Integer) item));
        }
        return list;
    }

    @Nullable
    public static List<FileData> files(JSONObject jsO) throws JSONException {
        if (jsO.isNull("files")) return null;

        List<FileData> list = new ArrayList();
        JSONArray jsonArray = jsO.getJSONArray("files");
        int len = jsonArray.length();
        for (int i = 0; i < len; i++) {
            Object item = jsonArray.get(i);
            if (!(item instanceof JSONObject)) continue;

            JSONObject itemJso = ((JSONObject) item);
            byte[] data = fetchHexStringAndConvertToBytes(itemJso, "data");
            if (itemJso.has("counter") && itemJso.has("signature")) {
                // DataProtectedBySignature
                int counter = itemJso.getInt("counter");
                JSONObject signatureJso = itemJso.getJSONObject("signature");
                FileDataSignature signature = new FileDataSignature(
                        fetchHexStringAndConvertToBytes(signatureJso, "startingSignature"),
                        fetchHexStringAndConvertToBytes(signatureJso, "finalizingSignature")
                );
                FileData.DataProtectedBySignature dpbs = new FileData.DataProtectedBySignature(
                        data,
                        counter,
                        signature,
                        fetchHexStringAndConvertToBytes(itemJso, "issuerPublicKey")
                );
                list.add(dpbs);
            } else {
                // DataProtectedByPasscode
                list.add(new FileData.DataProtectedByPasscode(data));
            }
        }
        return list;
    }

    public static List<FileSettingsChange> changes(JSONObject jsO) throws JSONException {
        List<FileSettingsChange> list = new ArrayList();
        JSONArray jsonArray = jsO.getJSONArray("changes");
        for (int i = 0; i < jsonArray.length(); i++) {
            Object item = jsonArray.get(i);
            if (!(item instanceof JSONObject)) continue;

            JSONObject itemJso = ((JSONObject) item);
            FileSettingsChange fsc = new FileSettingsChange(
                    itemJso.getInt("fileIndex"),
                    FileSettings.Companion.byRawValue(itemJso.getInt("settings"))
            );
            list.add(fsc);
        }
        return list;
    }

    public static WalletIndex walletIndexFromPublicKey(JSONObject jsO) throws JSONException {
        byte[] publicKey = walletPublicKey(jsO);
        return new WalletIndex.PublicKey(publicKey);
    }

    @Nullable
    public static WalletConfig walletConfig(JSONObject jsO) throws JSONException {
        if (!jsO.has("config")) return null;

        JSONObject jsonObject = jsO.getJSONObject("config");
        boolean containsIsReusable = jsonObject.has("isReusable");
        boolean containsProhibitPurgeWallet = jsonObject.has("prohibitPurgeWallet");
        EllipticCurve curve = null;
        if (jsonObject.has("curveId")) {
            String curveId = jsonObject.optString("curveId");
            curve = EllipticCurve.valueOf(curveId);
        }
        SigningMethod signingMethod = null;
        if (jsonObject.has("signingMethods")) {
            String signingMethods = jsonObject.optString("signingMethods");
            signingMethod = SigningMethod.valueOf(signingMethods);
        }
        return new WalletConfig(
                containsIsReusable ? jsonObject.getBoolean("isReusable") : null,
                containsProhibitPurgeWallet ? jsonObject.getBoolean("prohibitPurgeWallet") : null,
                curve,
                signingMethod
        );
    }
}

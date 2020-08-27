/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

        document.getElementById("btn_scanCard").addEventListener("click", onScan);
        document.getElementById("btn_sign").addEventListener("click", onSign);
        document.getElementById("btn_verify").addEventListener("click", onVerify);
        document.getElementById("btn_read_issuer_data").addEventListener("click", onReadIssuerData);
        document.getElementById("btn_write_issuer_data").addEventListener("click", onWriteIssuerData);
        document.getElementById("btn_read_issuer_extra_data").addEventListener("click", onReadIssuerExtraData);
        document.getElementById("btn_write_issuer_extra_data").addEventListener("click", onWriteIssuerExtraData);
        document.getElementById("btn_read_user_data").addEventListener("click", onReadUserData);
        document.getElementById("btn_write_user_data").addEventListener("click", onWriteUserData);
        document.getElementById("btn_write_user_protected_data").addEventListener("click", onWriteUserProtectedData);
        document.getElementById("btn_create_wallet").addEventListener("click", onCreateWallet);
        document.getElementById("btn_purge_wallet").addEventListener("click", onPurgeWallet);
        document.getElementById("btn_change_pin1").addEventListener("click", onChangePin1);
        document.getElementById("btn_change_pin2").addEventListener("click", onChangePin2);

        var cid = "BB03000000000004";

        var callback = {
            success: function(result) {
                console.log("result: " + JSON.stringify(result));
            },
            error: function(error) {
                console.log("error: " + JSON.stringify(error));
            }
        }

        function onScan() {
            TangemSdk.scanCard(callback);
        }

        function onSign() {
            TangemSdk.sign(callback, cid, [
                "44617461207573656420666f722068617368696e67",
                "4461746120666f7220757365642068617368696e67"
            ]);
        }

        function onVerify(){
            TangemSdk.verify(callback, cid, true);
        }

        function onReadIssuerData() {
            TangemSdk.readIssuerData(callback, cid);
        }

//        cid = "bb03000000000004"
//        Data = "Data to be written on a card as issuer data"
//        hexData = "4461746120746f206265207772697474656e206f6e20612063617264206173206973737565722064617461"
//        counter = 1
//        signedIssuerData = "eb75dd996d324a572d65358de4ab7fab822bd98f1ebe684d07fd2987f7820beecd8881cbeb81610fe17597d1a7f08167dc02bf5d6941ec3c2f9f40f2a4cc1784"
        function onWriteIssuerData() {
            TangemSdk.writeIssuerData(callback, cid,
                "4461746120746f206265207772697474656e206f6e20612063617264206173206973737565722064617461",
                "eb75dd996d324a572d65358de4ab7fab822bd98f1ebe684d07fd2987f7820beecd8881cbeb81610fe17597d1a7f08167dc02bf5d6941ec3c2f9f40f2a4cc1784",
                { issuerDataCounter: 1 }
            );
        }
        
        function onReadIssuerExtraData() {
            TangemSdk.readIssuerExtraData(callback, cid);
        }
        
        function onWriteIssuerExtraData() {
            TangemSdk.writeIssuerExtraData(callback, cid,
                "44617461207573656420666f722068617368696e67",
                "44617461207573656420666f722068617368696e67",
                "44617461207573656420666f722068617368696e67",
                { issuerDataCounter: 0 }
            );
        }
        
        function onReadUserData() {
            TangemSdk.readUserData(callback, cid);
        }
        
        function onWriteUserData() {
            TangemSdk.writeUserData(callback, cid,
                "44617461207573656420666f722068617368696e67", { userCounter: 0 });
        }

        function onWriteUserProtectedData() {
            TangemSdk.writeUserProtectedData(callback, cid,
                "44617461207573656420666f722068617368696e67", { userProtectedCounter: 0 });
        }
        
        function onCreateWallet() {
            TangemSdk.createWallet(callback, cid);
        }
        
        function onPurgeWallet() {
            TangemSdk.purgeWallet(callback, cid);
        }

        function onChangePin1() {
            TangemSdk.changePin1(callback, cid);
        }

        function onChangePin2() {
            TangemSdk.changePin2(callback, cid);
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

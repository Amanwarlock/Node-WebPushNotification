/** 
 * @author AmanKareem
*/
"use strict;"

const public_VAPID_key = "BDH59u6wmZjzfnpNvzrMxVX2zco3rIIzAYfPk9kKOOv0ac2YlcNOebRV0OaTiwNy1rztFZZ02tEvcNOqtQVvV7Y";

let swRegistration = null;
//Check if service worker is available with browser api;
if ("serviceWorker" in navigator) {
    initRegistration().catch(e => console.error(e));
}

function initRegistration() {
    return new Promise((resolve, reject) => {
        registerServiceWorker()
            .then(register => subscribe(register))
            .then(subscription => initialNotification(subscription))
            .then(() => resolve())
            .catch(e => reject(e));
    });
}

function registerServiceWorker() {
    return new Promise((resolve, reject) => {
        console.log("Registering service worker...");
        navigator.serviceWorker.register("/serviceWorker.js", { scope: "/" })
            .then(register => {
                console.log("Service worker registered...");
                swRegistration = register;
                resolve(register);
            })
            .catch(e => {
                console.error("Service worker registration failed : ", e);
                reject(e);
            });
    });
}

function subscribe(register) {
    return new Promise((resolve, reject) => {
        console.log("Registering Push Manager...");
        register.pushManager.subscribe({
            "userVisibleOnly": true,
            "applicationServerKey": urlBase64ToUint8Array(public_VAPID_key)
        })
            .then(subscription => {
                console.log("Push manager registered...");
                var localStorage = window.localStorage;
                localStorage.setItem("token", JSON.stringify(subscription));
                resolve(subscription);
            })
            .catch(e => {
                console.error("Push manager registration failed : ", e);
                reject(e);
            });
    });
}

function initialNotification(subscription) {
    return new Promise((resolve, reject) => {
        console.log("Sending push notification...");
        //This is google fetch api to make request from client
        // reference - https://developers.google.com/web/updates/2015/03/introduction-to-fetch
        fetch("/subscribe", {
            "method": "POST",
            "body": JSON.stringify({ "subscription": subscription, "message": "Hello ! This is freaking amazing" }),
            "headers": {
                "content-type": "application/json"
            }
        }).then(response => {
            if (response.status === 200 || response.status === 201) {
                response.json().then(data => {
                    console.log("Request success : ", data);
                    resolve();
                });
            }
        }).catch(e => {
            console.error("Fetch error : ", e);
            reject(e);
        });
    });
}

function sendNotification(id) {

    var message = document.getElementById("input").value;
    if (!message) {
        message = "Hello ! How you doing ?"
    }

    var subscription = window.localStorage.getItem("token");
    subscription = JSON.parse(subscription);

    if (!subscription) {
        getSubscription().then(subscription => {
            var localStorage = window.localStorage;
            localStorage.setItem("token", JSON.stringify(subscription));
            fetch("/subscribe", {
                "method": "POST",
                "body": JSON.stringify({ "subscription": subscription, "message": message }),
                "headers": {
                    "content-type": "application/json"
                }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    response.json().then(data => {
                        console.log("Request success : ", data);
                    });
                }
            }).catch(e => {
                console.error("Fetch error : ", e);
            });
        })
    } else {
        console.log("Sending push notification...");
        //This is google fetch api to make request from client
        // reference - https://developers.google.com/web/updates/2015/03/introduction-to-fetch
        fetch("/subscribe", {
            "method": "POST",
            "body": JSON.stringify({ "subscription": subscription, "message": message }),
            "headers": {
                "content-type": "application/json"
            }
        }).then(response => {
            if (response.status === 200 || response.status === 201) {
                response.json().then(data => {
                    console.log("Request success : ", data);
                });
            }
        }).catch(e => {
            console.error("Fetch error : ", e);
        });
    }
}

function getSubscription() {
    return swRegistration.pushManager.getSubscription(subscription => subscription).then().catch(e => console.error(e));

}

function unSubscribeUser() {
    return new Promise((resolve, reject) => {
        swRegistration.pushManager.getSubscription()
            .then(subscription =>{
                if(subscription){
                    subscription.unsubscribe().then(() => resolve());
                }
            });
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


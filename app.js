/**
 * @author AmanKareem <amanwarlock555@gmail.com>
 * @since 8th June 2018
 * References : 
 *  - https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications
 *  - https://developers.google.com/web/fundamentals/codelabs/push-notifications/
 *  - https://github.com/web-push-libs/web-push
 *  - https://developers.google.com/web/fundamentals/codelabs/push-notifications/
 */
"use strict;"
const express = require("express");
const bp = require("body-parser");
const path = require("path");
const webPush = require("web-push");

const app = express();
const port = 7000;

app.listen(port, () => console.log(`Server started on port ${port}`));

//Set static path to serve html's
app.use(express.static(path.join(__dirname, "client")));
app.use(bp.json());


/* 
    - Generation of VAPID public and private keys;
    - To generate this we need web-push module installed as npm package
    - Then navigate to your project i,e Node-Web-Push then run this command in terminal : ./node_modules/.bin/web-push generate-vapid-keys
    - or var vapidKeys = webPush.generateVAPIDKeys();
    - This VAPID Key should be generated only once;
 */
const public_VAPID_key = "BDH59u6wmZjzfnpNvzrMxVX2zco3rIIzAYfPk9kKOOv0ac2YlcNOebRV0OaTiwNy1rztFZZ02tEvcNOqtQVvV7Y";
const private_VAPID_key = "DwfvyS2pp75QNMfyxKHlb1V2sIYeVzElyg0ZVUWSaOg";
/*
   - Set vapid keys;
 */
webPush.setVapidDetails('mailto:amanwarlock555@gmail.com', public_VAPID_key, private_VAPID_key);

//Set up subscription route
app.post('/subscribe', (req, res) => {
    // Get push subscription object;
    let body = req.body;
    const subscription = body.subscription;
    const message = body.message;
   
    //Send - 201 - resource created:
    res.status(201).json({});

    // Create payload;
    const payload = JSON.stringify({ title: "Warlock Push Notification", body: message });

    //Pass payload object into push notification;
    webPush.sendNotification(subscription, payload).catch(e => console.error("Error occured while sending push notification : ", e));
})
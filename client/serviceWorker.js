/**
 * @author AmanKareem
 */

console.log("Service Worker Loaded...");

self.addEventListener("push", event => {
    const data = event.data.json();
    console.log("---data---", data);
    console.log("Push Recieved...");
    const notificationPromise = self.registration.showNotification(data.title, {
        body: data.body,
        icon: "../assets/warlock_logo.ico",
        badge: "../assets/warlock_logo.png",
        image: "../assets/warlock_logo.png",
        actions: [{
            action: 'coffee-action',
            title: 'Coffee',
            icon: '../assets/warlock_logo.png'
        }],
        sound : ""
    });

    event.waitUntil(notificationPromise);
});


self.addEventListener('notificationclick', function (event) {
    clients.matchAll().then(function (clis) {
        var client = clis.find(function (c) {
            c.visibilityState === 'visible';
        });
        if (client !== undefined) {
            client.navigate('some_url');
            client.focus();
        } else {
            // there are no visible windows. Open one.
            clients.openWindow('https://developers.google.com/web/');
            /*  event.waitUntil(
                 clients.openWindow('https://developers.google.com/web/')
             ); */
            //event.notification.close();
            self.registration.getNotifications().then(function (notifications) {
                notifications.forEach(function (notification) {
                    notification.close();
                });
            });
        }
    });
});
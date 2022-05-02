const CACHE_NAME = "cache_v6";

/** ACTION INSTALL **/
this.addEventListener('install', event => {
    self.skipWaiting();
    console.log('[Service Worker] is installed');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll([
                '/',
                './index.html',
                './style.css',
                './app.js',
                './manifest.webmanifest'
            ]);
        })
    );
});



/** ACTON FETCH **/
self.addEventListener("fetch", (event) => {
    /*
    event.respondWith(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (networkResponse) {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        }),
    );
    */
    event.respondWith(
        caches.match(event.request).catch(function () {
            return fetch(event.request).then(function (response) {
                return caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});



/** ACTION ACTIVATE **/
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] is activated');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


/** ACTION PUSH **/
self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = body => {
        // you could refresh a notification badge here with postMessage API
        const title = "Web Push example";

        return self.registration.showNotification(title, {
            body,
        });
    };

    if (event.data) {
        const message = event.data.text();
        event.waitUntil(sendNotification(message));
    }
});


/** ACTION NOTIFICATIONCLICK **/
self.addEventListener('notificationclick', event => {
    const notif = event.notification;
    const action = event.action;
    if (action === 'close') {
        notif.close();
    } else {
        clients.openWindow('https://premiere-demo.netlify.app/src/index.html');
        notif.close();
    }
});

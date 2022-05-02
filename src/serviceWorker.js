const CACHE_NAME = "cache_v7";

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
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }

            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(function (response) {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                var responseToCache = response.clone();

                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, responseToCache);
                });
                return response;
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

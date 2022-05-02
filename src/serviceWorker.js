const CACHE_NAME = "cache_v1";

/** ACTION INSTALL **/
this.addEventListener('install', event => {
    self.skipWaiting();
    console.log('[Service Worker] is installed');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
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
    // Nous voulons seulement répondre aux requêtes concernant notre application en testant l'URL de la requête
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
});



/** ACTION ACTIVATE **/
self.addEventListener('activate', function (event) {
    console.log('[Service Worker] is activated but without reset cache');
    /*
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME)
                        console.log('[Service Worker] is activated');
                    return caches.delete(cacheName);
                })
            );
        })
    );
    */
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

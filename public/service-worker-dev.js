workbox.core.setCacheNameDetails({ prefix: 'up-notifier' });
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

self.addEventListener('notificationclick', function(event) {
    if (!event.action) {
        return;
    }

    switch (event.action) {
        case 'check-out':
            openAppPage(event);
            break;
        default:
            break;
    }
});

const openAppPage = (event) => {
    const urlToOpen = new URL(`/`, self.location.origin).href;

    const promiseChain = self.clients
        .matchAll({
            type: 'window',
            includeUncontrolled: true,
        })
        .then((windowClients) => {
            let matchingClient = null;

            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.url === urlToOpen) {
                    matchingClient = windowClient;
                    break;
                }
            }
            if (matchingClient) {
                return matchingClient.focus();
            } else {
                return self.clients.openWindow(urlToOpen);
            }
        });

    event.waitUntil(promiseChain);
};

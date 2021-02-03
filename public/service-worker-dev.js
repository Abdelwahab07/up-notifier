self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', () => {
    self.clients.matchAll({ type: 'window' }).then((windowClients) => {
        for (const windowClient of windowClients) {
            windowClient.navigate(windowClient.url);
        }
    });
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

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

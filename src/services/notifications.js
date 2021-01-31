export const askPermission = async () => {
    const permissionResult_1 = await new Promise(function(resolve, reject) {
        const permissionResult = Notification.requestPermission(function(result) {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    });
    if (permissionResult_1 !== 'granted') {
        throw new Error("We weren't granted permission.");
    }
};

export const getNotificationPermissionState = async () => {
    if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'notifications' });
        return result.state;
    }

    return new Promise((resolve) => {
        resolve(Notification.permission);
    });
};

export const pushNotification = (newJobsNumber) => {
    navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(`There is ${newJobsNumber} new jobs!`, {
            body: "Don't miss your chance",
            icon: '../../public/img/notfication-icon.jpg',
            badge: '../../public/img/badge.png',
            actions: [
                {
                    action: 'check-out',
                    title: 'Check it out!',
                },
            ],
        });

        self.addEventListener('notificationclick', (event) => openAppPage(event));
    });
};

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

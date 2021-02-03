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
            icon: require('../assets/notfication-icon.jpg'),
            badge: require('../../public/img/badge.png'),
            actions: [
                {
                    action: 'check-out',
                    title: 'Check it out!',
                },
            ],
        });
    });
};

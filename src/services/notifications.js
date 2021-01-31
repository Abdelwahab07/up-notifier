export const NotificationPermission = async () => {
    Notification.requestPermission()
        .then()
        .then((permission) => {
            permission;
        });
};

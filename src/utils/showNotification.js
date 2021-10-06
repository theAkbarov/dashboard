import {notification} from "antd";

export const showNotification = (type, message, description, duration) => {
    notification[type]({
        message,
        description,
        duration
    });
};

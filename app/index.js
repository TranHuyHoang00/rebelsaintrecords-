import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native'

import { Redirect } from 'expo-router';
import { getDataLocal } from '@auths/localStorage';
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
const index = () => {
    const [account, setAccount] = useState();
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    useEffect(() => {
        handleGetAccount();
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { });
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const handleGetAccount = async () => {
        try {
            const data = await getDataLocal(process.env.EXPO_PUBLIC_ACCOUNT);
            if (data == null) { setAccount(false); }
            else { setAccount(true); }
        } catch (e) {
            Alert.alert("System Error");
        }
    }
    return (
        <>
            {account == false &&
                <Redirect href="/login" />}
            {account == true &&
                <Redirect href="/calender" />}

        </>
    )
}
export default index


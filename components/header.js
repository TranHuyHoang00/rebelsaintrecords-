import { StyleSheet, View, Pressable, Text } from 'react-native'
import React, { useState, useEffect } from 'react';
import { deleteDataLocal, getDataLocal } from '@auths/localStorage';
import { useRouter } from "expo-router";
import { deleteDevice } from '@services/api';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const header = () => {
    const router = useRouter();
    const [Menu, setMenu] = useState(false);
    useEffect(() => { }, []);

    const handleLogout = async () => {
        const deviceId = await getDataLocal('device_id');
        if (deviceId !== null) { await deleteDevice(deviceId); }
        await deleteDataLocal(process.env.EXPO_PUBLIC_ACCOUNT);
        await deleteDataLocal('device_id');
        router.push(`login`);
    }
    return (
        <View style={styles.header}>
            {Menu == true &&
                <Pressable onPress={handleLogout}  >
                    <Text style={styles.buttonLogOut}>Log out</Text>
                </Pressable>
            }
            {Menu == true ?
                <Pressable onPress={() => setMenu(false)}  >
                    <MaterialIcons name="menu-open" size={30} color="white" />
                </Pressable>
                :
                <Pressable onPress={() => setMenu(true)}  >
                    <Entypo name="menu" size={30} color="white" />
                </Pressable>
            }
        </View>
    )
}

export default header

const styles = StyleSheet.create({
    buttonLogOut: {
        color: "#ffde59",
        fontSize: 18,
        fontWeight: "400",
        marginRight: 50,
        borderColor: "#636663",
        borderWidth: 1,
        padding: 3,
        borderRadius: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 40,
        paddingBottom: 10,
    },
})
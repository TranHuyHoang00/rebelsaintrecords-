import { View, Text, StyleSheet, ImageBackground, Image, TextInput, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
const LogoImage = require("@assets/images/logo.png");
const Background = require("@assets/images/bg.png");
import { getUser, Login } from "@services/api";
import { useRouter } from "expo-router";
import { setDataLocal } from '@auths/localStorage';
import { getTokenDevice } from '@auths/exponentPushToken';
import { createDevice } from '@services/api';
import Spinner from 'react-native-loading-spinner-overlay';

const modal_login = () => {
    const router = useRouter();
    const [User, setUser] = useState({});
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        handleGetUser(id);
    }, []);
    const handleGetUser = async (id) => {
        setLoading(true);
        try {
            const data = await getUser(id);
            if (data && data.data && data.data.success == 1) {
                const dataOriginal = data.data.data;
                setUser(dataOriginal);
                setUsername(dataOriginal.username);
            }
        } catch (error) {
            Alert.alert("System Error");
        }
        setLoading(false);
    };
    const isCheckEmpty = (value) => {
        return value.trim().length
    }
    const isCheckSpace = (value) => {
        return (/\s/).test(value);
    }
    const Validation = (username, password) => {
        if (isCheckEmpty(username) == 0) {
            return { mess: "Username cannot be blank", code: 1 };
        }
        if (isCheckEmpty(password) == 0) {
            return { mess: "Password cannot be blank", code: 1 };
        }
        if (isCheckSpace(password) == true) {
            return { mess: "Password contains spaces", code: 1 };
        }
        return { code: 0 };
    }
    const handleCreateDevice = async (tokenDevice, userId) => {
        try {
            const data = await createDevice({ user_id: userId, push_token: tokenDevice });
            if (data && data.data && data.data.success == 1) {
                const dataOriginal = data.data.data;
                const result = await setDataLocal('device_id', dataOriginal.id);
                if (result == true) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (e) {
            return false;
        }
    }
    const handleLogin = async () => {
        const result = Validation(username, password);
        if (result.code == 0) {
            setLoading(true);
            try {
                const data = await Login(username, password);
                if (data && data.data && data.data.success == 1) {
                    const dataOriginal = data.data.data;
                    const resultSaveAccount = await setDataLocal(process.env.EXPO_PUBLIC_ACCOUNT, dataOriginal);
                    if (resultSaveAccount == false) { return; }
                    const tokenDevice = await getTokenDevice();
                    const resultCreateDevice = await handleCreateDevice(tokenDevice, dataOriginal.user.id);
                    if (resultCreateDevice == true) {
                        router.replace(`calender`);
                    } else {
                        Alert.alert(`Your device has an error`);
                    }
                } else {
                    Alert.alert(`Usename or password is incorrect`);
                }
            } catch (e) {
                Alert.alert(`Usename or password is incorrect 1`);
            }
            setLoading(false);
        } else {
            Alert.alert(result.mess);
        }
    }
    return (
        <View style={styles.containerBody}>
            <Spinner visible={loading} textContent={'Loading...'} />
            <ImageBackground source={Background} style={styles.containerBackground}>
                <View style={styles.containerHeadẻ}>
                    <Image source={LogoImage} style={styles.imageLogo} />
                </View>
                <View style={styles.containerMain}>
                    <View style={styles.containerBanner}>
                        <Image source={{ uri: User?.avatar }} style={styles.imageAvatar} />
                    </View>
                    <View style={styles.containerBanner}>
                        <Text style={styles.textBannerPassword}>ENTER YOUR IDENTITY CODE</Text>
                    </View>
                    <View style={styles.containerBanner}>
                        <TextInput
                            style={styles.inputPassword}
                            placeholder="*******"
                            secureTextEntry={true}
                            placeholderTextColor="#ffde59"
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <View style={styles.containerBanner}>
                        <Pressable style={styles.buttonLogin} onPress={handleLogin} >
                            <Text style={styles.textLogin}>LOGIN</Text>
                        </Pressable>
                    </View>
                    <View style={styles.containerBanner}>
                        <Pressable onPress={() => router.back()}  >
                            <Text style={styles.buttonBack}>BACK</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.containerFooter}>
                    <View>
                        <Text style={styles.textBannerWeb}>wwww.rebelsaintrecords.com</Text>
                    </View>
                    <View style={styles.footerBannerAdress}>
                        <Text style={styles.textBannerAddress}>
                            2022 © rebelsaintrecords | registered in Vietnam VAT number
                            0317147107 | RebelSaint Entertainment & Media Company Limited |
                            RSR Co., Ltd
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}
const styles = StyleSheet.create({
    imageAvatar: {
        height: 130,
        width: 130,
        borderRadius: 100,
        borderColor: "white",
        borderWidth: 2,
        resizeMode: 'cover',
    },
    textLogin: {
        color: "#49688d",
        fontSize: 18,
        fontWeight: "600",
    },
    buttonBack: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    buttonLogin: {
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 100,
        backgroundColor: "#ffde59",
    },
    inputPassword: {
        width: "80%",
        borderColor: "white",
        borderBottomWidth: 2,
        textAlign: "center",
        height: 50,
        color: "#ffde59",
        fontSize: 18,
    },
    containerBackground: {
        height: "100%",
        resizeMode: "cover",
        justifyContent: "center",
    },
    containerBody: {
        height: "100%",
        flexDirection: "column",
        backgroundColor: "#00030a",
    },
    containerMain: {
        flex: 1,
    },
    containerBanner: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    textBannerPassword: {
        fontStyle: "italic",
        padding: 10,
        color: "white",
        fontWeight: "700",
        fontSize: 20,
    },
    containerHeadẻ: {
        paddingHorizontal: 10,
        paddingTop: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    imageLogo: {
        width: 300,
        height: 100,
    },
    containerFooter: {
        justifyContent: "center",
        alignItems: "center",
    },
    textBannerWeb: {
        padding: 10,
        color: "white",
        fontWeight: "500",
    },
    footerBannerAdress: {
        width: "100%",
        backgroundColor: "#f8cf2c",
    },
    textBannerAddress: {
        padding: 4,
        textAlign: "center",
        color: "black",
        fontSize: 5,
    },
});
export default modal_login
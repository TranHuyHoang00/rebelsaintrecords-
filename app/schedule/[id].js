import { StyleSheet, Text, View, Pressable, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from "expo-router";
import Footer from '@components/footer';
import Header from '@components/header';
const Background = require("@assets/images/bg.png");
import { getSchedule } from '@services/api';
import { callPhone } from '@auths/handlePhone';
import { AntDesign, Entypo, FontAwesome, Fontisto, MaterialCommunityIcons, Foundation, FontAwesome5 } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
const detail = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [dataSchedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        handleGetSchedule(id);
    }, []);
    const handleGetSchedule = async (id) => {
        setLoading(true);
        try {
            const data = await getSchedule(id);
            if (data && data.data && data.data.success == 1) {
                const dataOriginal = data.data.data;
                setSchedule(dataOriginal)
            }
        } catch (error) {
            Alert.alert("System Error");
        }
        setLoading(false);
    };
    const formatTime = (time) => {
        if (time) {
            const timeParts = time.split(":");
            const formattedTime = timeParts[0] + ":" + timeParts[1];
            return formattedTime
        }
    }
    const pushScreen = (id, name) => {
        router.push({ pathname: `${name}`, params: { id } });
    };
    return (
        <View style={styles.containerBody}>
            <Spinner visible={loading} textContent={'Loading...'} />
            <ImageBackground source={Background} style={styles.containerBackground}>
                <Header />
                <View style={styles.containerMain}>
                    <View style={styles.containerNav}>
                        <Pressable style={styles.buttonBack} onPress={() => router.back()}>
                            <Text style={styles.textButtonBack}>BACK</Text>
                            <AntDesign name="caretleft" size={16} color="#49688d" />
                        </Pressable>
                        <View style={styles.containerNav}>
                            <Entypo name="clock" size={24} color="white" />
                            <Text style={styles.textShowTime}> {formatTime(dataSchedule?.time_localtion_id?.show_time)}</Text>
                        </View>
                    </View>
                    <View style={styles.containerSchedule}>
                        <View style={styles.headerSchedule}>
                            <View style={styles.containeLeft}>
                                <Text style={styles.textInfor}>Schedule Info</Text>
                                <Text style={styles.textBrand}>{dataSchedule?.brand_id?.name}</Text>
                            </View>
                            <View>
                                <Image style={styles.imageAvatar} source={{ uri: dataSchedule?.user_id?.avatar }} />
                            </View>
                        </View>
                        <View style={styles.mainSchedule}>
                            <TouchableOpacity onPress={() => pushScreen(dataSchedule?.time_localtion_id?.id, 'time_location')}>
                                <View style={styles.mainItemOfSchedule}>
                                    <View style={styles.containerTitle} >
                                        <Entypo name="back-in-time" size={22} color="black" />
                                        <Text style={styles.textTitle}>TIME - LOCATION</Text>
                                        <AntDesign name="enviromento" size={22} color="black" />
                                    </View>
                                    <View style={styles.containerTitle}>
                                        <Text style={styles.textDetail}>{formatTime(dataSchedule?.time_localtion_id?.show_time)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => pushScreen(dataSchedule.makeup_hair_id && dataSchedule.makeup_hair_id.id, 'makeup_hair')}>
                                <View style={styles.mainItemOfSchedule}>
                                    <View style={styles.containerTitle}>
                                        <FontAwesome name="paint-brush" size={22} color="black" />
                                        <Text style={styles.textTitle}>MAKE UP - HAIR</Text>
                                        <Fontisto name="person" size={22} color="black" />
                                    </View>
                                    <View style={styles.containerTitle}>
                                        <Text style={styles.textDetail}>Make up: {dataSchedule?.makeup_hair_id?.make_up}</Text>
                                    </View>
                                    <View style={styles.containerTitle}>
                                        <Text style={styles.textDetail}>Make hair: {dataSchedule?.makeup_hair_id?.make_hair}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => pushScreen(dataSchedule.stylist_id && dataSchedule.stylist_id.id, 'stylist')}>
                                <View style={styles.mainItemOfSchedule}>
                                    <View style={styles.containerTitle}>
                                        <Fontisto name="person" size={22} color="black" />
                                        <Text style={styles.textTitle}>STYLIST </Text>
                                        <MaterialCommunityIcons name="tshirt-v-outline" size={22} color="black" />
                                    </View>
                                    <View style={styles.containerTitle}>
                                        <Text style={styles.textDetail}>{dataSchedule?.stylist_id?.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.mainItemOfSchedule}>
                                <TouchableOpacity onPress={() => pushScreen(dataSchedule?.charge_of_id?.id, 'charge_of')}>
                                    <View style={styles.containerTitle}>
                                        <Entypo name="user" size={22} color="black" />
                                        <Text style={styles.textTitle}>PERSON IN CHARGE </Text>
                                        <FontAwesome name="user-secret" size={22} color="black" />
                                    </View>
                                    <View style={styles.containerTitle}>
                                        <Text style={styles.textDetail}>{dataSchedule?.charge_of_id?.name}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => callPhone(dataSchedule?.charge_of_id?.phone)}>
                                    <View style={styles.containerTitle}>
                                        <Text style={styles.textDetail}>{dataSchedule?.charge_of_id?.phone}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => pushScreen(dataSchedule?.charge_of_id?.id, 'note')}>
                                <View style={styles.mainItemOfSchedule}>
                                    <View style={styles.containerTitle}>
                                        <Foundation name="clipboard-notes" size={24} color="black" />
                                        <Text style={styles.textTitle}>NOTE </Text>
                                        <FontAwesome5 name="sticky-note" size={22} color="black" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Footer />
            </ImageBackground>
        </View>
    )
}
const styles = StyleSheet.create({
    textShowTime: {
        color: '#ffde59',
        fontSize: 18,
        fontWeight: '500',
    },
    mainSchedule: {
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    textTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        paddingHorizontal: 10,
    },
    textDetail: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
        color: '#3d3d3d',
    },
    mainItemOfSchedule: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        marginVertical: 5,
    },
    containerTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageAvatar: {
        height: 90,
        width: 90,
        borderRadius: 100,
        borderColor: "white",
        borderWidth: 2,
        resizeMode: 'cover',
    },
    headerSchedule: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: "white",
        borderWidth: 1,
        marginHorizontal: 20,
        marginTop: 15,
        padding: 15,
        borderRadius: 10,
    },
    containeLeft: {
        textAlign: 'center',
    },
    textInfor: {
        fontSize: 22,
        fontWeight: "600",
        textAlign: 'center',
        color: 'white',
    },
    textBrand: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: "500",
        color: '#ebe6e6',
    },
    containerSchedule: {
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 5,
    },
    textButtonBack: {
        color: "#49688d",
        fontSize: 14,
        fontWeight: "800",
        paddingRight: 5,
    },
    buttonBack: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 100,
        backgroundColor: "#ffde59",
    },
    containerNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    containerBody: {
        height: "100%",
        flexDirection: "column",
        backgroundColor: "#00030a",
    },
    containerBackground: {
        height: "100%",
        resizeMode: "cover",
        justifyContent: "center",
    },
    containerMain: {
        flex: 1,
    },
})
export default detail

import { StyleSheet, Text, View, Pressable, ImageBackground, ScrollView, Alert,TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from "expo-router";
import Footer from '@components/footer';
import Header from '@components/header';
import { getTimeLocation } from '@services/api';
import { AntDesign, Entypo } from '@expo/vector-icons';
const Background = require("@assets/images/bg.png");
import Spinner from 'react-native-loading-spinner-overlay';
import { callPhone } from '@auths/handlePhone';
const timeLocation = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [dataTimeLocation, setDataTimeLocation] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (id) { handleGetDataTimeLocation(id); }
    }, []);

    const handleGetDataTimeLocation = async (id) => {
        setLoading(true);
        try {
            const data = await getTimeLocation(id);
            if (data && data.data && data.data.success == 1) {
                const dataOriginal = data.data.data;
                setDataTimeLocation(dataOriginal);
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
                    </View>
                    <View style={styles.containerTitle}>
                        <Entypo name="back-in-time" size={22} color="black" />
                        <Text style={styles.textTitle}>TIME - LOCATION</Text>
                        <AntDesign name="enviromento" size={22} color="black" />
                    </View>
                    <ScrollView style={styles.containerScrollView}>
                        <View style={styles.containerMainInfor}>
                            <View style={styles.containerListInfor}>
                                <Text style={styles.textLable}>Show date :</Text>
                                <View style={styles.containerInfor}>
                                    <Text style={styles.textInfor}>{dataTimeLocation?.show_date}</Text>
                                </View>
                            </View>
                            <View style={styles.containerListInfor}>
                                <Text style={styles.textLable}>Show time :</Text>
                                <View style={styles.containerInfor}>
                                    <Text style={styles.textInfor}>{formatTime(dataTimeLocation?.show_time)}</Text>
                                </View>
                            </View>
                            <View style={styles.containerListInfor}>
                                <Text style={styles.textLable}>Leave time :</Text>
                                <View style={styles.containerInfor}>
                                    <Text style={styles.textInfor}>{formatTime(dataTimeLocation?.leave_time)}</Text>
                                </View>
                            </View>
                            <View style={styles.containerListInfor}>
                                <Text style={styles.textLable}>Make up time :</Text>
                                <View style={styles.containerInfor}>
                                    <Text style={styles.textInfor}>{formatTime(dataTimeLocation?.make_up_time)}</Text>
                                </View>
                            </View>
                            <View style={styles.containerListInfor}>
                                <Text style={styles.textLable}>Show location :</Text>
                                <View style={styles.containerInfor}>
                                    <Text style={styles.textInfor}>{dataTimeLocation?.show_localtion}</Text>
                                </View>
                            </View>
                            <View style={styles.containerListInfor}>
                                <Text style={styles.textLable}>Agency name :</Text>
                                <View style={styles.containerInfor}>
                                    <Text style={styles.textInfor}>{dataTimeLocation?.agency_name}</Text>
                                </View>
                            </View>
                            <View style={styles.containerListInfor}>
                                <Text style={styles.textLable}>Contact :</Text>
                                <TouchableOpacity onPress={() => callPhone(dataTimeLocation?.contact)}>
                                    <View style={styles.containerInfor}>
                                        <Text style={styles.textInfor}>{dataTimeLocation?.contact}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <Footer />
            </ImageBackground>
        </View>
    )
}

export default timeLocation

const styles = StyleSheet.create({
    containerScrollView: {
        paddingHorizontal: 20,
    },
    containerListInfor: {
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    containerMainInfor: {
        padding: 0,
    },
    containerInfor: {
        borderBottomWidth: 1,
        borderBottomColor: '#b0b0b0',
        paddingVertical: 5,
    },
    textLable: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
    textInfor: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center'
    },
    textTitle: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 10,
    },
    containerTitle: {
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginVertical: 10,
        marginHorizontal: 10,
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
        paddingVertical: 10,
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
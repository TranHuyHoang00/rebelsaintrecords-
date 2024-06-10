import { StyleSheet, Text, View, Pressable, ImageBackground, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from "expo-router";
import Footer from '@components/footer';
import Header from '@components/header';
import { getChargeOf } from '@services/api';
import { AntDesign, Entypo, FontAwesome, } from '@expo/vector-icons';
const Background = require("@assets/images/bg.png");
import Spinner from 'react-native-loading-spinner-overlay';
const note = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [dataChargeOf, setDataChargeOf] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (id) { handleGetDataChargeOf(id); }
    }, []);

    const handleGetDataChargeOf = async (id) => {
        setLoading(true);
        try {
            const data = await getChargeOf(id);
            if (data && data.data && data.data.success == 1) {
                const dataOriginal = data.data.data;
                setDataChargeOf(dataOriginal);
            }
        } catch (error) {
            Alert.alert("System Error");
        }
        setLoading(false);
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
                    </View>
                    <View style={styles.containerTitle}>
                        <Entypo name="user" size={22} color="black" />
                        <Text style={styles.textTitle}>NOTE</Text>
                        <FontAwesome name="user-secret" size={22} color="black" />
                    </View>
                    <ScrollView style={styles.containerScrollView}>
                        <View style={styles.containerMainInfor}>
                            <View style={styles.containerListInfor}>
                                <Text style={styles.textLable}>Content :</Text>
                                <View style={styles.containerInfor}>
                                    <Text style={styles.textInfor}>{dataChargeOf?.note}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <Footer />
            </ImageBackground>
        </View>
    )
}

export default note

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
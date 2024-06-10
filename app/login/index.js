import { View, Text, StyleSheet, ImageBackground, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Carousel from "react-native-snap-carousel";
import { getListUser } from "@services/api";
import { useRouter } from "expo-router";
const Background = require("@assets/images/bg.png");
const LogoImage = require("@assets/images/logo.png");
import Spinner from 'react-native-loading-spinner-overlay';
const Login = () => {
    const router = useRouter();
    const isCarousel = React.useRef(null);
    const SLIDER_WIDTH = Dimensions.get("window").width;
    const [Artists, setArtists] = useState([]);
    const [Managers, setManager] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        handleGetListUser();
    }, []);

    const handleGetListUser = async () => {
        setLoading(true);
        try {
            const data = await getListUser();
            if (data && data.data && data.data.success == 1) {
                const dataOriginals = data.data.data;
                const dataArtists = dataOriginals.filter((obj) => obj?.role?.name === "artist");
                const dataManagers = dataOriginals.filter((obj) => obj?.role?.name === "manager");
                setArtists(dataArtists);
                setManager(dataManagers);
            }
        } catch (error) {
            console.error("Error Server");
        }
        setLoading(false);
    };
    const pushScreen = (id) => {
        router.push({ pathname: `modal_login`, params: { id: id } });
    };
    const CarouselCardItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => pushScreen(item?.id)}>
                <View style={styles.containerCarousel} key={item?.id}>
                    <Image source={{ uri: item?.avatar }} style={styles.imageAvatar} />
                    <View style={styles.containerFullName}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textFullName}>
                            {item?.fullname}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <View style={styles.containerBody}>
            <Spinner visible={loading} textContent={'Loading...'} />
            <ImageBackground source={Background} style={styles.containerBackground}>
                <View style={styles.containerHeader}>
                    <Image source={LogoImage} style={styles.imageLogo} />
                </View>
                <View style={styles.containerMain}>
                    <View style={styles.mainBannerWelcom}>
                        <Text style={styles.textBannerWelcom}>
                            WELCOME TO THE HOUSE OF REBELLIOUS DREAMERS
                        </Text>
                    </View>
                    <View style={styles.mainBannerQuestion}>
                        <Text style={styles.textBannerQuestion}>WHO ARE YOU ?</Text>
                    </View>
                    <View style={styles.containerCarousel}>
                        <Carousel
                            layout="default"
                            layoutCardOffset={9}
                            ref={isCarousel}
                            data={Artists}
                            renderItem={CarouselCardItem}
                            sliderWidth={SLIDER_WIDTH - (SLIDER_WIDTH - 310)}
                            itemWidth={150}
                            itemHeight={150}
                            inactiveSlideShift={0}
                            useScrollView={true}
                            activeSlideAlignment={"start"}
                            inactiveSlideScale={1}
                            inactiveSlideOpacity={1}
                        />
                    </View>
                    <View style={styles.containerCarousel}>
                        <Carousel
                            layout="default"
                            layoutCardOffset={9}
                            ref={isCarousel}
                            data={Managers}
                            renderItem={CarouselCardItem}
                            sliderWidth={150}
                            itemWidth={150}
                            itemHeight={150}
                            inactiveSlideShift={0}
                            useScrollView={true}
                        />
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
export default Login
const styles = StyleSheet.create({
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
    containerHeader: {
        paddingHorizontal: 10,
        paddingTop: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    imageLogo: {
        width: 300,
        height: 100,
    },
    containerMain: {
        flex: 1,
    },
    mainBannerWelcom: {
        backgroundColor: "#d40404",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    textBannerWelcom: {
        textAlign: 'center',
        padding: 5,
        color: "white",
        fontWeight: "700",
        fontSize: 12,
    },
    mainBannerQuestion: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    textBannerQuestion: {
        padding: 10,
        color: "#ffde59",
        fontWeight: "700",
        fontSize: 18,
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
    containerCarousel: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingVertical: 10,
    },
    containerCarousel: {
        justifyContent: "center",
        alignItems: "center",
    },
    imageAvatar: {
        height: 130,
        width: 130,
        borderRadius: 100,
        borderColor: "white",
        borderWidth: 2,
        resizeMode: 'cover',
    },
    containerFullName: {
        overflow: "hidden",
        marginHorizontal: 10,
    },
    textFullName: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        paddingTop: 10,
    },
})
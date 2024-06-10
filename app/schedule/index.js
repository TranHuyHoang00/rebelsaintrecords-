import { StyleSheet, Text, View, Pressable, ImageBackground, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from "expo-router";
import Footer from '@components/footer';
import Header from '@components/header';
const Background = require("@assets/images/bg.png");
import { getListSchedule } from '@services/api';
import { AntDesign } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
const schedule = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [Schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    handleGetListSchedule(params);
  }, []);

  const handleGetListSchedule = async (value) => {
    setLoading(true);
    try {
      const data = await getListSchedule(value);
      if (data && data.data && data.data.success == 1) {
        const dataOriginal = data.data.data;
        dataOriginal.sort((a, b) => {
          const dateA = new Date("2023-01-01 " + a?.time_localtion_id?.show_time);
          const dateB = new Date("2023-01-01 " + b?.time_localtion_id?.show_time);
          return dateA - dateB;
        });
        setSchedules(dataOriginal)
      }
    } catch (error) {
      console.error("Error:", error);
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
  const pushScreen = (id) => {
    router.push({ pathname: `schedule/${id}` });
  };
  return (
    <View style={styles.containerBody}>
      <Spinner visible={loading} textContent={'Loading...'} />
      <ImageBackground source={Background} style={styles.containerBackground}>
        <Header />
        <View style={styles.containerMain}>
          <View style={styles.containerNav}>
            <Pressable style={styles.buttonBack} onPress={() => router.back()} >
              <Text style={styles.textButtonBack}>BACK</Text>
              <AntDesign name="caretleft" size={16} color="#49688d" />
            </Pressable>
            <View style={styles.containerNav}>
              <AntDesign name="calendar" size={20} color="white" />
              <Text style={styles.textTime}>{params?.date}</Text>
            </View>
          </View>
          <ScrollView style={styles.containerScrollView}>
            <View style={styles.containerSchedule}>
              {Schedules && Schedules.map((item, index) => {
                return (
                  <TouchableOpacity key={item.id} onPress={() => pushScreen(item.id)}>
                    <View style={styles.mainSchedule}>
                      <Image source={{ uri: item?.user_id?.avatar }} style={styles.imageAvatar} />
                      <View style={styles.containerInfor}>
                        <Text style={styles.textInfor}>Schedule Info {index + 1} </Text>
                        <Text style={styles.textBrand}>{item?.brand_id?.name}</Text>
                      </View>
                      <View>
                        <Text style={styles.textTimeStart}>{formatTime(item?.time_localtion_id?.show_time)} </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>
        </View>
        <Footer />
      </ImageBackground>
    </View>
  )
}
const styles = StyleSheet.create({
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
  textTime: {
    color: '#ffde59',
    fontSize: 18,
    fontWeight: '500',
  },
  containerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  containerSchedule: {

  },
  textTimeStart: {
    borderColor: "#636663",
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    fontWeight: '500'
  },
  imageAvatar: {
    height: 70,
    width: 70,
    borderRadius: 100,
    borderColor: "black",
    borderWidth: 2,
    resizeMode: 'cover',
  },
  containerInfor: {
    textAlign: 'center',
  },
  textInfor: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: 'center',
  },
  textBrand: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: "500",
    color: '#737573',
  },
  mainSchedule: {
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerScrollView: {
    paddingHorizontal: 20,
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
export default schedule

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import Footer from "../../components/footer";
import Header from "../../components/header";
import { Calendar } from "react-native-big-calendar";
import { getListUser, getListSchedule } from "@services/api";
import { getDataLocal } from "@auths/localStorage";
import dayjs from "dayjs";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import Spinner from 'react-native-loading-spinner-overlay';
const Background = require("@assets/images/bg.png");
const calender = () => {
  const router = useRouter();
  const [dataSchedules, setDataSchedules] = useState<
    { title: string; start: any; end: any; color: string }[]
  >([]);
  const [filterType, setFilterType] = useState({});
  const [date, setDate] = React.useState(dayjs());
  const [monthNow, setMonthNow] = useState<{ id: number; name: string }>();
  const [yearNow, setYearNow] = useState<number>();
  const dataMonths = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" },
  ];
  const [openDropDown, setOpenDropDown] = useState(false);
  const [valueDropDown, setValueDropDown] = useState(0);
  const [Users, setUsers] = useState<{ label: string; value: number }[]>([]);
  const [isUser, setIsUser] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getDataAccount();
    getMonthNow(new Date());
  }, []);
  const handleGetListUser = async () => {
    try {
      const data = await getListUser();
      if (data && data.data && data.data.success == 1) {
        const dataOriginal = data.data.data;
        const dataArtists = dataOriginal.filter(
          (obj: any) => obj?.role?.name == "artist"
        );
        let Users = [{ label: "All Artist", value: 0 }];
        for (const i of dataArtists) {
          const obj: { label: string; value: number } = {
            label: i.fullname,
            value: i.id,
          };
          Users.push(obj);
        }
        setUsers(Users);
      }
    } catch (error) {
      console.error("Error in component:", error);
    }
  };
  const getDataAccount = async () => {
    try {
      const data = await getDataLocal(process.env.EXPO_PUBLIC_ACCOUNT);
      if (data !== null) {
        let obj = {};
        if (data?.user?.role?.name == "manager") {
          obj = { user_id: 0, date: formatDate(new Date(), 1), type_date: 1 };
          setIsUser(true);
          handleGetListUser();
        } else {
          obj = {
            user_id: data?.user?.id,
            date: formatDate(new Date(), 1),
            type_date: 1,
          };
          setIsUser(false);
        }
        handleGetListSchedule(obj);
        setFilterType(obj);
      }
    } catch (e) {
      Alert.alert("System Error");
    }
  };

  // HANDLE SCHEDULE FOR CALENDAR
  const handleGetListSchedule = async (value: any) => {
    setLoading(true);
    try {
      const data = await getListSchedule(value);
      if (data && data.data && data.data.success == 1) {
        const dataOriginal = data?.data?.data;
        const dataFilterSchedules = handleFilterDataSchedules(dataOriginal);
        if (dataFilterSchedules) {handleSetDataSchedules(dataFilterSchedules);}
      }
    } catch (error) {
      Alert.alert("System Error");
    }
    setLoading(false);
  };
  const handleSetDataSchedules = (data: any) => {
    let newDataSchedules: any = [];
    for (const item of data) {
      const date: any = formatDate(item?.time_localtion_id?.show_date, 2);
      const color = item?.user_id?.color;
      let itemSchedule = {
        title: item?.user_id?.fullname,
        start: new Date(date),
        end: new Date(date),
        color: color ? color : "#1E90FF",
      };
      newDataSchedules.push(itemSchedule);
    }
    setDataSchedules(newDataSchedules);
  };
  const handleFilterDataSchedules = (data: any) => {
    const uniqueEvents = new Set();
    const filterDataEvents = data.filter((item: any) => {
      const key = item?.user_id?.fullname + item?.time_localtion_id?.show_date;
      const isUnique = !uniqueEvents.has(key);
      if (isUnique) {
        uniqueEvents.add(key);
      }
      return isUnique;
    });
    return filterDataEvents;
  };

  // FORMAT DATE
  const formatDate = (value: any, type: number) => {
    switch (type) {
      case 1:
        return moment(new Date(value)).format("DD-MM-YYYY");
      case 2:
        return moment(new Date(value)).format("YYYY-MM-DD");
      case 3:
        return moment(new Date(value)).format("DD-MM-YYYY");
      default:
        break;
    }
  };
  // GET DATA MONTH
  const getMonthNow = (value: any) => {
    const dateObject = new Date(value);
    const year = dateObject.getFullYear();
    setYearNow(year);
    const month: any = dateObject.getMonth() + 1;
    for (const item of dataMonths) {
      if (item.id == month) {
        setMonthNow(item);
      }
    }
  };
  // ONCLICK EVENT
  const onClickDate = (value: any) => {
    const date = formatDate(value, 3);
    router.push({
      pathname: `schedule`,
      params: { user_id: filterType.user_id, date: date, type_date: 2 },
    });
  };
  const onClickEvent = (value: any) => {
    const date = formatDate(value.start, 3);
    router.push({
      pathname: `schedule`,
      params: { user_id: filterType.user_id, date: date, type_date: 2 },
    });
  };

  // ONCHANGE USER FILTER
  const onChangeItemDropUser = (value: any) => {
    let data: any = filterType;
    data.user_id = value;
    handleGetListSchedule(data);
  };

  // PREV - NEXT MONTH
  const onPrev = () => {
    setDate(date.add(-1, "month"));
    getMonthNow(date.add(-1, "month"));
  };
  const onNext = () => {
    setDate(date.add(1, "month"));
    getMonthNow(date.add(1, "month"));
  };
  return (
    <View style={styles.containerBody}>
      <Spinner visible={loading} textContent={"Loading..."} />
      <ImageBackground source={Background} style={styles.containerBackground}>
        <Header />
        <View style={styles.containerMain}>
          {isUser ? (
            <View style={styles.containerNavBar}>
              <View style={styles.containerDropUser}>
                <DropDownPicker
                  open={openDropDown}
                  value={valueDropDown}
                  items={Users}
                  setOpen={setOpenDropDown}
                  setValue={setValueDropDown}
                  onChangeValue={onChangeItemDropUser}
                  containerStyle={{ width: 130 }}
                  style={styles.DropDownPicker}
                  dropDownContainerStyle={{ backgroundColor: "white" }}
                  ArrowDownIconComponent={({ style }) => (
                    <AntDesign name="filter" size={20} color="black" />
                  )}
                />
              </View>
              <View style={styles.containerSelectMonth}>
                <Pressable style={styles.buttonPrev} onPress={onPrev}>
                  <AntDesign name="left" size={24} color="#d60202" />
                </Pressable>
                <View>
                  <Text style={styles.textMonth}>{monthNow?.name}</Text>
                  <Text style={styles.textYear}>{yearNow}</Text>
                </View>
                <Pressable style={styles.buttonNext} onPress={onNext}>
                  <AntDesign name="right" size={24} color="#d60202" />
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.containerSelectMonth}>
              <Pressable style={styles.buttonPrev} onPress={onPrev}>
                <AntDesign name="left" size={24} color="#d60202" />
              </Pressable>
              <View>
                <Text style={styles.textMonth}>{monthNow?.name}</Text>
                <Text style={styles.textYear}>{yearNow}</Text>
              </View>
              <Pressable style={styles.buttonNext} onPress={onNext}>
                <AntDesign name="right" size={24} color="#d60202" />
              </Pressable>
            </View>
          )}
          <Calendar
            date={date.toDate()}
            height={600}
            events={dataSchedules}
            mode={"month"}
            onPressCell={(value) => onClickDate(value)}
            onPressEvent={(event) => onClickEvent(event)}
            calendarCellTextStyle={{ color: "white" }}
            swipeEnabled={false}
            eventCellStyle={(event: { color?: string }) => {
              return [
                { backgroundColor: event.color ?? "blue" },
                { borderWidth: 1, borderColor: "white" },
              ];
            }}
          />
        </View>
        <Footer />
      </ImageBackground>
    </View>
  );
};

export default calender;

const styles = StyleSheet.create({
  DropDownPicker: {
    backgroundColor: "#ffde59",
    borderRadius: 40,
  },
  button_text: {
    color: "#49688d",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonPrev: {
    width: 40,
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  buttonNext: {
    width: 40,
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  textMonth: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    paddingHorizontal: 10,
  },
  textYear: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  containerNavBar: {
    zIndex: 500,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  containerSelectMonth: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  containerDropUser: {
    paddingRight: 5,
  },
  header: {},
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
});

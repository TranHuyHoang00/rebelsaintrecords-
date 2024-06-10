import AsyncStorage from '@react-native-async-storage/async-storage';
const getDataLocal = async (name) => {
    try {
      const jsonData = await AsyncStorage.getItem(name);
      const value = JSON.parse(jsonData);
      if (value !== null) {
        return value;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
const setDataLocal = async(name, data) => {
    try {
        const jsonData = JSON.stringify(data);
        await AsyncStorage.setItem(name, jsonData);
        return true;
      } catch (e) {
        return false;
      }
}
const deleteDataLocal = async(name) => {
    try {
        await AsyncStorage.removeItem(name);
        return true;
      } catch (e) {
        return false;
      }
}
export {
    getDataLocal, setDataLocal, deleteDataLocal
}
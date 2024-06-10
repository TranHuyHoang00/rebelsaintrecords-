import Toast from 'react-native-toast-message';
const showToast = async (type,title,description) => {
    Toast.show({
        type: type,
        text1: title,
        text2: description,
    });
}
export {
    showToast
}
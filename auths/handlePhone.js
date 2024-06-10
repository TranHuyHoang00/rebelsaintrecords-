import * as Linking from "expo-linking";

const callPhone = async (phone) => {
    if (!phone) {
        return;
    }
    Linking.openURL(`tel:${phone}`);
}
export {
    callPhone
}
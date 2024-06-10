import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const footer = () => {
    return (
        <View style={styles.footer}>
            <Text style={styles.textFooterWeb}>wwww.rebelsaintrecords.com</Text>
        </View>
    )
}

export default footer

const styles = StyleSheet.create({
    footer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'black',
    },
    textFooterWeb: {
        padding: 10,
        color: "white",
        fontWeight: "500",
    },
})
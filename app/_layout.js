import React from 'react'
import { Stack } from 'expo-router';
const _layout = () => {
    return (
        <Stack>
            <Stack.Screen name='index' options={{headerShown: false}} />
            <Stack.Screen name='login' options={{headerShown: false}} />
            <Stack.Screen name='modal_login' options={{headerShown: false}} />
            <Stack.Screen name='calender' options={{headerShown: false}} />
            <Stack.Screen name='schedule' options={{headerShown: false}} />
            <Stack.Screen name='charge_of' options={{headerShown: false}} />
            <Stack.Screen name='note' options={{headerShown: false}} />
            <Stack.Screen name='stylist' options={{headerShown: false}} /> 
            <Stack.Screen name='makeup_hair' options={{headerShown: false}} />
            <Stack.Screen name='time_location' options={{headerShown: false}} />
        </Stack>
    )
}
export default _layout
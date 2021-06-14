import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'

export default function CBack() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Image source={require('../../assets/back.png')} style={{ width: 30, height: 20,marginVertical:-30}} resizeMode="contain" />
        </TouchableOpacity>
    )
}

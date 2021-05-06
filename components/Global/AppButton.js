import React from 'react'
import { View, Text,TouchableOpacity,ActivityIndicator } from 'react-native'
import { commonStyles } from '../../theme'

export default function AppButton({text, onPress, isLoading=false, style={},textStyle}) {
    return (
        <TouchableOpacity style={[commonStyles.btnContainer,style]} onPress= {onPress}>
            {
                isLoading?
                <ActivityIndicator color ={'white'} />
                :
                <Text style={[commonStyles.btnText,textStyle]}>{text}</Text>
            }
        </TouchableOpacity>
    )
}

import React from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { commonStyles } from '../theme'
import { CartButton } from './Global/CartButton'

export default function CustomHeader({title}) {
    const masterCart = useSelector(state => state.masterCart)
    return (
        <View style={[commonStyles.row,{justifyContent:'space-between'}]}>
            <Text>{title}</Text>
            <CartButton/>
        </View>
    )
}

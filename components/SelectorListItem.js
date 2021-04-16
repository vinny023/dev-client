import React from 'react'
import {Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';


export default function SelectorListItem({ screen, item }) {
    const navigation = useNavigation();

    if (screen==="OrderDetailScreen") {
        const order = item
        return (
            <TouchableOpacity 
                style={{padding: 20, backgroundColor: '#FDD7E4', alignSelf: 'stretch',  textAlign: 'center',}}
                onPress={() => navigation.navigate(screen, order)}
            >
            <Text>{order.supplier} - {order.estimatedDeliveryDate}</Text>            
            </TouchableOpacity>
         )
    } 
    
    
}
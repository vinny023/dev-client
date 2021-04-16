import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import {connect} from 'react-redux'
import { useNavigation } from '@react-navigation/native';

export function CartButton({masterCart}) {

    const navigation = useNavigation();
        
        return (
            <TouchableOpacity
            style={{height: 10, width: 10, backgroundColor: 'blue', color: 'white'}}
            onPress={() => navigation.navigate('CartScreen')}
            >
                <Text>Cart: {masterCart.reduce((length, supplierCart) => {
                    if (supplierCart.cart) {
                        return length + supplierCart.cart.length
                    } else {
                        return length
                    }              

                    },0)}
                </Text>                     
            </TouchableOpacity>
        )
    }

const mapStateToProps = state => {
    return (
        {
            masterCart: state.cartState.masterCart,
        }
    )
}

export default connect(mapStateToProps,null)(CartButton)

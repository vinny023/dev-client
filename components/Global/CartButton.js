import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux'
import { useNavigation } from '@react-navigation/native';
import { colors, sizes } from '../../theme';

export function CartButton({ masterCart }) {

    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.cartButtonContainer}
            onPress={() => navigation.navigate('CartScreen')}
        >
            <Image source={require('../../assets/cartIcon.png')} color={colors.blue} size={sizes.s16} style={{marginRight:10}} />
            <Text style={styles.cartItems}>{masterCart.reduce((length, supplierCart) => {
                if (supplierCart.cart) {
                    return length + supplierCart.cart.length
                } else {
                    return length
                }
            }, 0)}
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

export default connect(mapStateToProps, null)(CartButton)
export const styles = StyleSheet.create({
    cartButtonContainer: {
        backgroundColor: colors.blue.light,
        color: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius:20,
        paddingHorizontal:20,
        paddingVertical:10,
        marginRight:15,
       
    },
    cartItems: {
        fontSize: sizes.s20,
        color: colors.blue.primary,
    }
})
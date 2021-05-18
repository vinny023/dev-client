import { round } from 'lodash';
import { Item } from 'native-base';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { colors, commonStyles, sizes } from '../../theme';

const OrderTotal = (props) => {
    const { order } = props
    const { deliveryFee} = order

    const orderTotal = order.cart.reduce((total, item) => total + item.price*item.quantity, 0)  + order.deliveryFee

    return (
        <View style={[commonStyles.card]}>
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <Text style={styles.lightText}>{deliveryFee > 0 ? "Subtotal" : "Total"}</Text>
                <Text style={styles.boldText}>${(orderTotal - deliveryFee).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
            </View>
            {deliveryFee > 0 &&
                <View>
                    <View style={[styles.row]}>
                        <Text style={styles.lightText}>Delivery Fee</Text>
                        <Text style={styles.boldText}>${deliveryFee.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </Text>
                    </View>
                    <View style={[styles.row]}>
                        <Text style={styles.lightText}>Total</Text>
                        <Text style={styles.boldText}>${orderTotal.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                    </View>
                    {props.showAdd &&
                        <View style={[styles.row]}>

                            {/* <Text>Add {order.supplierDetail.orderMinimum - orderTotal - deliveryFee} to hit minimum.</Text> */}
                            <Text style={styles.lightText}>Add</Text>
                            <Text style={styles.boldText}>${round(order.supplierDetail.orderMinimum - orderTotal - deliveryFee,0)}</Text>
                        </View>
                    }
                </View>
            }
        </View>
    )
}

export default OrderTotal

const styles = StyleSheet.create({
    lightText: {
        //fontSize: sizes.s17,
        fontSize: sizes.s15,
        fontFamily: 'regular',
        color: colors.grey.primary
    },
    boldText: {
        fontFamily: 'medium',
        //fontSize: sizes.s19,
        fontSize: sizes.s16,
        color: colors.text
    },
    row:{
        ...commonStyles.row,
        justifyContent: 'space-between',
        paddingVertical:0,
        paddingBottom:10
    }
})
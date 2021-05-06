import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { colors, commonStyles, sizes } from '../../theme';

const OrderTotal = (props) => {
    const { order } = props
    const { deliveryFee, orderTotal } = order

    return (
        <View style={commonStyles.card}>
            <View style={[commonStyles.row, { justifyContent: 'space-between' }]}>
                <Text style={styles.lightText}>{deliveryFee > 0 ? "Subtotal" : "Total"}</Text>
                <Text style={styles.boldText}>${orderTotal - deliveryFee}</Text>
            </View>
            {deliveryFee > 0 &&
                <View>
                    <View style={[commonStyles.row, { justifyContent: 'space-between' }]}>
                        <Text style={styles.lightText}>Delivery Fee</Text>
                        <Text style={styles.boldText}>${deliveryFee} </Text>
                    </View>
                    <View style={[commonStyles.row, { justifyContent: 'space-between' }]}>
                        <Text style={styles.lightText}>Total</Text>
                        <Text style={styles.boldText}>${orderTotal}</Text>
                    </View>
                    {props.showAdd &&
                        <View style={[commonStyles.row, { justifyContent: 'space-between' }]}>

                            {/* <Text>Add {order.supplierDetail.orderMinimum - orderTotal - deliveryFee} to hit minimum.</Text> */}
                            <Text style={styles.lightText}>Add</Text>
                            <Text style={styles.boldText}>${order.supplierDetail.orderMinimum - orderTotal - deliveryFee}</Text>
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
        fontFamily: 'medium',
        color: colors.grey.primary
    },
    boldText: {
        fontFamily: 'medium',
        //fontSize: sizes.s19,
        fontSize: sizes.s16,
        color: colors.text
    },
})
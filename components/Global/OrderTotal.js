import React from 'react';
import {View, Text, Button} from 'react-native';

const OrderTotal = (props) => {
    const {order} = props
    const {deliveryFee, orderTotal} = order

    return (
        <View>
        <Text>{deliveryFee > 0 ? "Subtotal" : "Total"} : {orderTotal - deliveryFee}</Text>
              {deliveryFee > 0 && 
       <View>
       <Text>Delivery Fee: {deliveryFee} </Text>
       <Text>Total: {orderTotal} </Text>
       {props.showAdd &&
            <Text>Add {order.supplierDetail.orderMinimum - orderTotal - deliveryFee} to hit minimum.</Text> 
        }
       </View>
        }
       </View>
    )
}

export default OrderTotal


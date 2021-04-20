import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Image, TextInput } from 'react-native';
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
import { colors, sizes } from '../../theme';
import AppButton from '../AppButton';
// import {placeOrder} from '../../apis/apis'
import ProductList from '../Global/ProductList'
import OrderTotal from '../Global/OrderTotal'

const createDaySelection = ({ shippingDoW, shippingCutoff, shippingDays }) => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const availableDays = weekdays.filter((val, i) => shippingDoW.indexOf(i) !== -1)
    const currentTime = new Date();
    const offset = currentTime.getHours() > shippingCutoff ? 1 : 0
    const firstDay = currentTime.getDay() + shippingDays + offset

    return Array(shippingDoW.length).fill(0).map((val, i) => {
        const day = availableDays[(firstDay + i) % availableDays.length]
        const dateOffset = firstDay + i + (firstDay + i) % availableDays.length
        const date = new Date()

        date.setDate(currentTime.getDate() + dateOffset)
        return ({
            day: day,
            date: date
        }
        )
    })
}

export class SupplierCart extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            placingOrder: false,
            orderPlaced: false,
            placeOrderError: false,
        }

        this.updateOrderDetails = this.updateOrderDetails.bind(this)
    }

    //PASS STATE UP
    updateOrderDetails = (update) => {
        this.props.updateOrderDetails({ index: this.props.index, update: update })
    }

    placeOrder = () => {
        this.props.placeOrder({ index: this.props.index })
    }

    render() {


        const { navigation, index } = this.props

        let { shippingTimeSlots } = {}
        let deliveryFee, orderTotal;
        if (this.props.supplierOrder) {
            ({ deliveryFee, orderTotal } = this.props.supplierOrder)
        }

        // }    
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

        const date = new Date()

        return (
            <View>
                <ProductList productList={this.props.supplierOrder.cart} navigation={navigation} listType="noFlatList" />
                {this.props.supplierOrder.placed ?
                    <></>
                    : <View style={{paddingBottom:20,borderRadius:10}}>
                        {!this.props.supplierDetail ?
                            <Text>Loading Supplier Detail</Text> :
                            this.props.supplierDetail.logo ?
                                <View>
                                    <Image
                                        source={{ uri: this.props.supplierDetail.logo }}
                                        style={{ width: 100, height: 100 }}
                                    />
                                    <Text>{this.props.supplierDetail.displayName}</Text>
                                    <Text>{this.props.supplierOrder.supplierId}</Text>
                                </View> : <></>
                        }

                        {(this.props.supplierDetail && this.props.supplierOrder) ?
                            <View style={{ backgroundColor: colors.white, padding: 20, borderRadius: 10 }} >
                                <View style={styles.row}>
                                    <Text>{deliveryFee > 0 ? "Subtotal" : "Total"} : </Text>
                                    <Text>{orderTotal - deliveryFee}</Text>
                                </View>
                                {deliveryFee > 0 ?
                                    <View>
                                        <View style={styles.row}>
                                            <Text style={styles.lightText}>Delivery Fee: </Text>
                                            <Text style={styles.boldText}>{this.props.supplier.deliveryFee} </Text>
                                        </View>
                                        <View style={styles.row}>
                                            <Text style={styles.lightText}>Total: </Text>
                                            <Text style={styles.boldText}>{this.props.supplier.orderTotal} </Text>
                                        </View>
                                        <View style={styles.row}>
                                            <Text style={styles.lightText}>Add </Text>
                                            <Text style={styles.boldText}>{this.props.supplierDetail.orderMinimum - tiorderTotal - deliveryFee}</Text>
                                        </View>
                                    </View> : <></>
                                }
                            </View> : <></>
                        }

                        <TextInput placeholder="Enter any special notes or requests"
                            onSubmitEditing={text => this.props.updateOrderDetails({ update: { specialNotes: text }, index: index })} />

                        {!this.props.supplierDetail ?
                            <Text>Loading shipping options</Text> :

                            <View>
                                {this.props.supplierDetail.shippingTimeSlots.map(val => {
                                    const label = 'O' + (this.props.supplierOrder.selectedDeliveryTimeSlot && this.props.supplierOrder.selectedDeliveryTimeSlot === val ? '(Selected)' : '')
                                    return (
                                        <View>
                                            <Text>{val}</Text>
                                            <Button
                                                title={label}
                                                onPress={() => this.props.updateOrderDetails({ update: { selectedDeliveryTimeSlot: val }, index: index })}
                                            />
                                        </View>

                                    )

                                })

                                }

                                {createDaySelection(this.props.supplierDetail).map(val => {
                                    const label = 'O' + (this.props.supplierOrder.selectedDeliveryDate && this.props.supplierOrder.selectedDeliveryDate.day === val.day ? '(Selected)' : '')
                                    return (
                                        <View>
                                            <Text>{val.day} - {val.date.getMonth()}/{val.date.getDate()}</Text>
                                            <Button
                                                title={label}
                                                onPress={() => this.props.updateOrderDetails({ update: { selectedDeliveryDate: val }, index: index })}
                                            />
                                        </View>
                                    )
                                })
                                }


                            </View>
                        }


                    </View>
                }
                <View>
                    {this.props.supplierOrder.placed ?
                        <View>
                            <Text>Order Placed!</Text>
                            <Button
                                title="View and Manage Order ->"
                                onPress={() => navigation.navigate("OrderDetailScreen", supplierCart)}
                            />
                        </View>
                        : <View>
                            {this.state.placingOrder ?
                                <Text>Loading Place Order</Text> :
                                <AppButton
                                    text={"Place Order (" + this.props.supplierOrder.cart.length + ")"}
                                    onPress={() => this.props.placeOrder({ index: this.props.index })}
                                />
                            }
                        </View>
                    }
                </View>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return { removeOrderedCart: supplierId => dispatch(actions.removeOrderedCart(supplierId)) }
}

export default connect(null, mapDispatchToProps)(SupplierCart)
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    lightText: {
        fontSize: sizes.s17,
        fontFamily: 'medium',
        color: colors.grey.primary
    },
    boldText: {
        fontFamily: 'medium',
        fontSize: sizes.s19,
        color: colors.text
    }
})
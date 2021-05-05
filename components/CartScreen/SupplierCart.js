import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Image, TextInput, ActivityIndicator, ScrollView, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
import { colors, commonStyles, sizes } from '../../theme';
import AppButton from '../Global/AppButton';
// import {placeOrder} from '../../apis/apis'
import ProductList from '../Global/ProductList'
import OrderTotal from '../Global/OrderTotal'
import { RadioButton } from 'react-native-paper';
import Modal from 'react-native-modal'
import { Ionicons } from '@expo/vector-icons';


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
            date: date.getMonth() + '/' + date.getDate()
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
            toggleDateFilter: false,
            toggleNotesFilter: false
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
        console.log(this.props.supplierOrder.cart, "this is the cart we are getting")
        return (
            <View>

                {this.props.supplierOrder.placed ?
                    <></>
                    : <View style={{ paddingBottom: 20, borderRadius: 10 }}>
                        {!this.props.supplierDetail ?
                            <ActivityIndicator size="small" color={colors.blue.primary} style={{ flex: 1, }} /> :
                            this.props.supplierDetail.logo ?
                                <View style={{ padding: 10 }}>
                                    {/* <Image
                                        source={{ uri: this.props.supplierDetail.logo }}
                                        style={{ width: 100, height: 100 }}
                                    />
                                    <Text >{this.props.supplierOrder.supplierId}</Text> */}
                                    <Text style={styles.text}>{this.props.supplierDetail.displayName}</Text>
                                </View> : <></>
                        }
                        <View style={{ padding: 10, backgroundColor: colors.white, borderRadius: 10, marginTop: 5 }}>
                            <ProductList productList={this.props.supplierOrder.cart} navigation={navigation} listType="noFlatList" />
                        </View>
                        {/* ----------- Set Delivery Card ---------*/}
                        <TouchableOpacity style={styles.container} onPress={() => this.setState({ toggleDateFilter: true })}>
                            <View style={[styles.row, { paddingVertical: 0, paddingTop: 10 }]}>
                                <Text style={styles.heading}>Delivery</Text>
                                <Text style={styles.boldText}>Monday - 4/12</Text>
                            </View>
                            <View style={[styles.row, { paddingVertical: 3 }]}>
                                <TouchableOpacity >
                                    <Text style={{ color: colors.blue.primary, fontSize: sizes.s15, fontFamily: 'regular' }}>Tap to Edit</Text>
                                </TouchableOpacity>
                                <Text style={commonStyles.lightText}>12AM - 5AM</Text>
                            </View>
                        </TouchableOpacity>
                        {/* ---------- Add notes Card ---------- */}
                        <TouchableOpacity style={[styles.container, { marginVertical: 0, marginBottom: 10 }]} onPress={() => this.setState({ toggleNotesFilter: true })}>
                            <View style={[commonStyles.row, { justifyContent: 'space-between', }]}>
                                <Text style={styles.heading}>Add Order notes</Text>
                                <Ionicons name="chevron-forward" color="#191C1F" />
                            </View>
                        </TouchableOpacity>
                        {(this.props.supplierDetail && this.props.supplierOrder) ?
                            <View style={{ backgroundColor: colors.white, padding: 20, borderRadius: 10 }} >
                                {/* <View style={styles.row}>
                                    <Text >{deliveryFee > 0 ? "Subtotal" : "Total"} : </Text>
                                    <Text>{orderTotal - deliveryFee}</Text>
                                </View> */}
                                {/*   {deliveryFee > 0 ?
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
                                }*/}

                                <View>
                                    <View style={styles.row}>
                                        <Text style={styles.lightText}>Free Delivery Minimum </Text>
                                        <Text style={styles.boldText}>$ 1024</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.lightText}>Subtotal: </Text>
                                        <Text style={styles.boldText}>$ 1,100.00</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.lightText}>Delivery Fee: </Text>
                                        <Text style={styles.boldText}>$ 20</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.lightText}>Total </Text>
                                        <Text style={styles.boldText}>$ 1,500</Text>
                                    </View>
                                </View>
                            </View> : <></>
                        }
                        {/*-------- Select Delivery Modal --------- */}
                        {!this.props.supplierDetail ?
                            <ActivityIndicator size="small" color={colors.blue.primary} style={{ flex: 1, alignSelf: 'center' }} /> :
                            this.state.toggleDateFilter &&
                            <Modal
                                animationType="slide"
                                backdropOpacity={.5}
                                style={commonStyles.modalView}
                                isVisible={this.state.toggleDateFilter}

                            >
                                <KeyboardAvoidingView>

                                    <View style={commonStyles.centeredView}>
                                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                                                <TouchableOpacity style={{ alignSelf: 'flex-start' }}>
                                                    <Ionicons name='ios-arrow-back' size={sizes.s25} />
                                                </TouchableOpacity>

                                                <Text style={{ fontSize: sizes.s20, fontFamily: 'regular', color: colors.text, flex: 1, textAlign: 'center' }}>Select Delivery</Text>
                                            </View>
                                            <Text style={styles.heading}>Select Day</Text>
                                            <View style={[styles.container, { marginBottom: 15 }]}>
                                                {createDaySelection(this.props.supplierDetail).map(val => {
                                                    const label = 'O' + (this.props.supplierOrder.selectedDeliveryDate && this.props.supplierOrder.selectedDeliveryDate.day === val.day ? '(Selected)' : '')
                                                    return (

                                                        <View style={commonStyles.row}>
                                                            <RadioButton
                                                                value={label}
                                                                label={label}
                                                                uncheckedColor={'#E6F0FD'}
                                                                color={colors.blue.primary}
                                                                status={label.includes("Selected") ? 'checked' : 'unchecked'}
                                                                onPress={() => this.props.updateOrderDetails({ update: { selectedDeliveryDate: val }, index: index })}
                                                            />
                                                            <View style={{ marginLeft: 7 }}>
                                                                <Text style={commonStyles.text}>{val.day} - {val.date}</Text>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                                }
                                            </View>

                                            <Text style={styles.heading}>Select Time</Text>
                                            <View style={styles.container}>
                                                {this.props.supplierDetail.shippingTimeSlots.map(val => {
                                                    const label = 'O' + (this.props.supplierOrder.selectedDeliveryTimeSlot && this.props.supplierOrder.selectedDeliveryTimeSlot === val ? '(Selected)' : '')
                                                    return (

                                                        <View style={commonStyles.row}>
                                                            <RadioButton
                                                                value={label}
                                                                label={label}
                                                                uncheckedColor={'#E6F0FD'}
                                                                color={colors.blue.primary}
                                                                status={label.includes("Selected") ? 'checked' : 'unchecked'}
                                                                onPress={() => this.props.updateOrderDetails({ update: { selectedDeliveryTimeSlot: val }, index: index })} />
                                                            <View style={{ marginLeft: 7 }}>
                                                                <Text style={commonStyles.text}>{val.replace('(Selected)', '')}</Text>
                                                            </View>
                                                        </View>

                                                    )
                                                })

                                                }
                                            </View>
                                        </ScrollView>
                                        <AppButton text="APPLY" style={{ marginHorizontal: 10 }} onPress={() => this.setState({ toggleDateFilter: false })} />
                                    </View>
                                </KeyboardAvoidingView>

                            </Modal>
                        }
                        {/* -------- Add notes Modal ------------ */}
                        <Modal
                            animationType="slide"
                            backdropOpacity={.5}
                            style={commonStyles.modalView}
                            isVisible={this.state.toggleNotesFilter}
                        >
                            <View style={[commonStyles.centeredView,]}>
                                <ScrollView style={{ padding: 20 }} >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <TouchableOpacity style={{ alignSelf: 'flex-start', paddingBottom: 15 }} onPress={() => this.setState({ toggleNotesFilter: false })} >
                                            <Ionicons name='close' size={sizes.s20} />
                                        </TouchableOpacity>
                                        <Text style={[commonStyles.lightText, { color: colors.blue.primary }]}>Reset</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: sizes.s20 + 2, fontFamily: 'bold', color: colors.text, }}>Add Order Notes</Text>
                                        <View style={{ paddingTop: 30 }}>
                                            <Text style={commonStyles.lightText}>Type in any special requests or notes.</Text>
                                        </View>
                                        <View style={{ marginTop: 15 }}>
                                            <TextInput
                                                multiline
                                                numberOfLines={12}
                                                style={styles.input}
                                                onSubmitEditing={text => this.props.updateOrderDetails({ update: { specialNotes: text }, index: index })} />
                                        </View>
                                    </View>
                                </ScrollView>
                                <View style={{ flex:1,paddingBottom:20 }}>

                                    <AppButton text="APPLY" style={{ marginHorizontal: 10}} onPress={() => this.setState({ toggleNotesFilter: false })} />
                                </View>
                            </View>
                        </Modal>
                    </View>
                }
                <View>
                    {this.props.supplierOrder.placed ?
                        <View>
                            <Text>Order Placed!</Text>
                            <AppButton
                                text="View and Manage Order ->"
                                onPress={() => navigation.navigate("OrderDetailScreen", supplierCart)}
                            />
                        </View>
                        : <View>
                            {this.state.placingOrder ?
                                <ActivityIndicator size="small" color={colors.blue.primary} style={{ flex: 1, alignSelf: 'center' }} /> :
                                <View>
                                    <AppButton
                                        text={"Place Order (" + this.props.supplierOrder.cart.length + ")"}
                                        onPress={() => this.props.placeOrder({ index: this.props.index })}
                                        style={{ marginTop: 0, backgroundColor: 'black', }}
                                    //backgroundColor:'rgba(0,0,0,.4)'
                                    />
                                </View>
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
        //fontSize: sizes.s17,
        fontSize: sizes.s15,
        fontFamily: 'medium',
        color: colors.grey.primary
    },
    boldText: {
        fontFamily: 'medium',
        fontSize: sizes.s16,
        // fontSize: sizes.s19,
        color: colors.text
    },
    heading: {
        //paddingTop: 10,
        //fontSize: sizes.s17,
        fontSize: sizes.s15,
        fontFamily: 'medium',
        color: colors.grey.primary
    },
    container: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 10,
        marginVertical: 10
    },
    text: {
        fontFamily: 'medium',
        // fontSize: sizes.s17,
        fontSize: sizes.s15,
        color: colors.grey.primary
    },
    input: {
        padding: 10,

        lineHeight: 23,
        flex: 2,
        textAlignVertical: 'top',
        backgroundColor: 'white',
        borderRadius: 10
    },

})
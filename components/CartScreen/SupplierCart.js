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
import { createIconSetFromFontello, Ionicons } from '@expo/vector-icons';
import _ from 'lodash';


class SpecialNotesBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            specialNotes: this.props.specialNotes ? this.props.specialNotes : ''
        }
    }

    render() {
        return (
            <View style={[commonStyles.centeredView,]}>


                <ScrollView style={{ padding: 20 }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ alignSelf: 'flex-start', paddingBottom: 15 }} onPress={() => this.props.hideNotesModal()} >
                            <Ionicons name='close' size={sizes.s20} />
                        </TouchableOpacity>
                        <Text style={[commonStyles.lightText, { color: colors.blue.primary }]}>Reset</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: sizes.s20 + 2, fontFamily: 'bold', color: colors.text, }}>Add order notes</Text>
                        <View style={{ paddingTop: 15 }}>
                            <Text style={commonStyles.lightText}>Type in any special requests or notes.</Text>
                        </View>
                        <View style={{ marginTop: 15, height: sizes.large, backgroundColor: 'white', borderRadius: 10 }}>
                            <TextInput
                                multiline={true}
                                numberOfLines={16}
                                defaultValue={this.state.specialNotes ? this.state.specialNotes : ''}
                                style={styles.input}
                                onChangeText={text => this.setState({ specialNotes: text })} />
                        </View>
                    </View>
                </ScrollView>
                <View>
                    <AppButton text="Add notes" style={{ marginHorizontal: 10 }} onPress={() => {
                        this.props.updateOrderDetails({ update: { specialNotes: this.state.specialNotes } })
                        this.props.hideNotesModal()
                    }} />
                </View>
            </View>
        )
    }
}



const createDaySelection = ({ DoW, shippingCutoff, shippingDays }) => {

    //     console.log('SHIPPING Cuttoff')
    //     console.log(shippingCutoff)

    //    console.log('SHIPPING DAYS')
    //    console.log(shippingDays)


    //    console.log('DOW')
    //    console.log(DoW)

    const millisecondsInDays = 86400000

    //take the next seven days of dates
    const now = new Date()


    //find earliest possible delivery day based on shipping days & cutoff time and 7 days after that
    const offset = now.getHours() > shippingCutoff ? 1 : 0

    const next7 = Array(7).fill(null).map((val, i) => {
        let nextDay = new Date(now.getTime() + (shippingDays + offset + i) * millisecondsInDays)
        return nextDay
    })

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    console.log('NEXT 7')
    console.log(next7)

    //if it fits the category - in DoW and within 7 days
    const returnVal = next7.filter((val, i) => DoW.indexOf(val.getDay()) !== -1 && val.getTime() - now.getTime() < 7 * millisecondsInDays)
        .map((val, i) => {
            return { day: daysOfWeek[val.getDay()], date: (val.getMonth() + 1).toString() + '/' + val.getDate() }
        })

    console.log('RETURN VAL')
    console.log(returnVal)

    return returnVal
}

export class SupplierCart extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            placingOrder: false,
            orderPlaced: false,
            placeOrderError: false,
            toggleDateFilter: false,
            toggleNotesFilter: false,
        }

        this.updateOrderDetails = this.updateOrderDetails.bind(this)

        console.log('OCNSTRUCTIONS UPPLIER CART')
        console.log(this.props.supplierDeliverySettings)

    }

    //WRITE ORDER UPDATE TO STORE
    updateOrderDetails = ({ update }) => {
        console.log('Running update order details')
        console.log(update)
        this.props.updateOrderDetails({ supplierId: this.props.supplierDetail.id, update: update })
    }

    hideNotesModal = () => {
        this.setState({ toggleNotesFilter: false })
    }

    placeOrder = () => {
        this.props.placeOrder({ index: this.props.index })
    }

    setDefaultDelivery = () => {
        if (this.props.supplierDetail) {
            const { selectedDeliveryDate, selectedDeliveryTimeSlot } = this.props.supplierOrder

            const deliveryDays = createDaySelection({ DoW: this.props.supplierDeliverySettings.DoW, ...this.props.supplierDetail })
            console.log('DELIVERY DAYS')
            console.log(deliveryDays)

            let update = {}
            

            if (!selectedDeliveryDate && !selectedDeliveryTimeSlot) {
                update = {
                    selectedDeliveryDate: deliveryDays[0],
                    selectedDeliveryTimeSlot: this.props.supplierDeliverySettings.windows[0]
                }
            } else if (!selectedDeliveryTimeSlot) {
                update = { selectedDeliveryTimeSlot: this.props.supplierDeliverySettings.windows[0] }
            } else if (!selectedDeliveryTimeSlot) {
                update = { selectedDeliveryDate: deliveryDays[0] }
            } else if (selectedDeliveryDate) {
                //if dates are selected - make sure they are in range - if not set as default
                let selectedDateInRange = false
                for (const day in deliveryDays) {
                    if (_.isEqual(selectedDeliveryDate,day)) {
                        selectedDateInRange = true
                    }
                }
                if (!selectedDateInRange) {
                                    update = { selectedDeliveryDate: deliveryDays[0], }
                    this.updateOrderDetails({update: update})                
                }
                
            }

            if ((!selectedDeliveryDate || !selectedDeliveryTimeSlot)) {
                this.updateOrderDetails({ update: update })
            }
        }
    }

    setSpecialNotes = (specialNotes) => {
        this.setState({
            specialNotes: specialNotes
        })
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('COMPONTENT DID UPDATE')
        console.log(this.props)
        if (!_.isEqual(prevProps.supplierDetail, this.props.supplierDetail)) {
            this.setDefaultDelivery()
        }

    }
    componentDidMount() {
        console.log('COMPONTENT DID MOUNT')
        console.log(this.props)
        this.setDefaultDelivery()

    }

    render() {
        console.log('RENDER')
        const { navigation, index } = this.props

        let { shippingTimeSlots } = {}
        let deliveryFee, orderTotal, supplierDetail;
        if (this.props.supplierOrder) {
            ({ deliveryFee, orderTotal, supplierDetail } = this.props.supplierOrder)
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
                        <View style={commonStyles.card}>
                            <ProductList productList={this.props.supplierOrder.cart} navigation={navigation} listType="noFlatList" />
                        </View>
                        {/* ----------- Set Delivery Card ---------*/}
                        <TouchableOpacity onPress={() => this.setState({ toggleDateFilter: true })} style={[commonStyles.card]}>
                            <View style={[styles.row, { paddingBottom: 3 }]}>
                                <Text style={[styles.heading]}>Delivery</Text>
                                {this.props.supplierOrder.selectedDeliveryDate &&
                                    <>
                                    <Text style={styles.boldText}>{this.props.supplierOrder.selectedDeliveryDate.day} - {this.props.supplierOrder.selectedDeliveryDate.date}</Text>
                                    </>
                                }
                            </View>
                            <View style={[styles.row, { paddingBottom: 0 }]}>
                                <TouchableOpacity >
                                    <Text style={{ color: colors.blue.primary, fontSize: sizes.s14, fontFamily: 'regular' }}>Tap to Edit</Text>
                                </TouchableOpacity>
                                {this.props.supplierOrder.selectedDeliveryTimeSlot &&
                                    <>
                                <Text style={commonStyles.lightText}>{this.props.supplierOrder.selectedDeliveryTimeSlot}</Text>
                                </>
                                }
                            </View>
                        </TouchableOpacity>
                        {/* ---------- Add notes Card ---------- */}
                        <TouchableOpacity style={[commonStyles.card]} onPress={() => this.setState({ toggleNotesFilter: true })}>
                            <View style={[commonStyles.row, { justifyContent: 'space-between', paddingVertical: 0 }]}>
                                <Text style={styles.heading}>Add Order notes</Text>
                                <Ionicons name="chevron-forward" color="#191C1F" />
                            </View>
                        </TouchableOpacity>
                        {(this.props.supplierDetail && this.props.supplierOrder) ?
                            <View style={[commonStyles.card]} >
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
                                    <View style={[styles.row]}>
                                        <Text style={styles.heading}>Minimum </Text>
                                        <Text style={styles.boldText}>${this.props.supplierDetail.orderMinimum.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.heading}>Subtotal</Text>
                                        <Text style={styles.boldText}>${(orderTotal - deliveryFee).toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.heading}>Delivery fee</Text>
                                        <Text style={styles.boldText}>${deliveryFee.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.heading}>Total</Text>
                                        <Text style={styles.boldText}>${orderTotal.toFixed(2)}</Text>
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

                                <View style={commonStyles.centeredView}>
                                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <TouchableOpacity style={{ alignSelf: 'flex-start', paddingBottom: 15 }} onPress={() => this.setState({ toggleDateFilter: false })} >
                                                <Ionicons name='close' size={sizes.s20} />
                                            </TouchableOpacity>
                                            <Text style={[commonStyles.lightText, { color: colors.blue.primary }]}>Reset</Text>
                                        </View>
                                        <View style={{ paddingBottom: 12 }}>
                                            <Text style={{ fontSize: sizes.s20 + 2, fontFamily: 'bold', color: colors.text, }}>Select Delivery</Text>
                                        </View>
                                        <Text style={styles.heading}>Select Day</Text>
                                        <View style={[commonStyles.card, { padding: 5,marginTop:7, }]}>
                                            {createDaySelection({DoW: this.props.supplierDeliverySettings.DoW, ...this.props.supplierDetail}).map(val => {
                                                const label = 'O' + (this.props.supplierOrder.selectedDeliveryDate && _.isEqual(this.props.supplierOrder.selectedDeliveryDate,val) ? '(Selected)' : '')
                                                return (
                                                    <View style={[commonStyles.row, { paddingVertical: 3 }]}>
                                                        <RadioButton
                                                            value={label}
                                                            label={label}
                                                            uncheckedColor={'#E6F0FD'}
                                                            color={colors.blue.primary}
                                                            status={label.includes("Selected") ? 'checked' : 'unchecked'}
                                                            onPress={() => this.updateOrderDetails({ update: { selectedDeliveryDate: val } })}
                                                        />
                                                        <View >
                                                            <Text style={commonStyles.text}>{val.day} - {val.date}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                            }
                                        </View>

                                        <Text style={styles.heading}>Select Time</Text>
                                        <View style={[commonStyles.card, { padding: 5, marginTop: 7 }]}>
                                            {this.props.supplierDeliverySettings.windows.map(val => {
                                                const label = 'O' + (this.props.supplierOrder.selectedDeliveryTimeSlot && this.props.supplierOrder.selectedDeliveryTimeSlot === val ? '(Selected)' : '')
                                                return (
                                                    <View style={[commonStyles.row, { paddingVertical: 3 }]}>
                                                        <RadioButton
                                                            value={label}
                                                            label={label}
                                                            uncheckedColor={'#E6F0FD'}
                                                            color={colors.blue.primary}
                                                            status={label.includes("Selected") ? 'checked' : 'unchecked'}
                                                            onPress={() => this.updateOrderDetails({ update: { selectedDeliveryTimeSlot: val } })} />
                                                        <View >
                                                            <Text style={commonStyles.text}>{val.replace('(Selected)', '')}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                            }
                                        </View>
                                    </ScrollView>
                                    <AppButton text="APPLY" style={{ marginHorizontal: 20 }} onPress={() => this.setState({ toggleDateFilter: false })} />
                                </View>

                            </Modal>
                        }
                        {/* -------- Add notes Modal ------------ */}
                        <Modal
                            animationType="slide"
                            backdropOpacity={.5}
                            style={commonStyles.modalView}
                            isVisible={this.state.toggleNotesFilter}

                        >
                            <SpecialNotesBox hideNotesModal={this.hideNotesModal} updateOrderDetails={this.updateOrderDetails} specialNotes={this.props.supplierOrder.specialNotes} />
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
                            {(this.state.placingOrder || !supplierDetail) ?
                                <ActivityIndicator size="small" color={colors.blue.primary} style={{ flex: 1, alignSelf: 'center' }} /> :
                                <View>
                                    <AppButton
                                        text={"Place "+supplierDetail.displayName+" Order"}
                                        onPress={() => this.props.placeOrder({ index: this.props.index })}
                                        style={{ backgroundColor: colors.blue.light, marginVertical: -20,marginBottom: 20, elevation: 0 }}
                                        textStyle={{color:colors.blue.primary}}
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
    return {
        removeOrderedCart: supplierId => dispatch(actions.removeOrderedCart(supplierId)),
        updateOrderDetails: params => dispatch(actions.updateOrderDetails(params))
    }
}

export default connect(null, mapDispatchToProps)(SupplierCart)
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 10
        //paddingVertical: 10
    },
    // lightText: {
    //     //fontSize: sizes.s17,
    //     fontSize: sizes.s16,
    //     fontFamily: 'medium',
    //     color: colors.grey.primary
    // },
    boldText: {
        fontFamily: 'medium',
        fontSize: sizes.s17,
        // fontSize: sizes.s19,
        color: colors.text
    },
    heading: {
        //paddingTop: 10,
        //fontSize: sizes.s17,
        fontSize: sizes.s15,
        fontFamily: 'regular',
        color: colors.grey.primary
    },
    container: {
        backgroundColor: colors.white,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginVertical: 5
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
        // backgroundColor: 'white',
        // borderRadius: 10
    },

})
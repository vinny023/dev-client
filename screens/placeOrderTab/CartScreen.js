import React from 'react';
import { connect } from 'react-redux'
import { Text, View, Image, Button, ScrollView, StyleSheet } from 'react-native'
import SupplierCart from '../../components/CartScreen/SupplierCart'
import Banner from '../../components/Global/Banner'
import { getCartSuppliers, placeOrder } from '../../apis/apis'
import _ from 'lodash';
// import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import { ThemeProvider } from '@react-navigation/native';
import axios from 'axios';
import * as actions from '../../redux/actions.js'
import { colors, commonStyles, sizes } from '../../theme';
import AppButton from '../../components/AppButton';
import { Ionicons } from '@expo/vector-icons';
//import { TouchableOpacity } from 'react-native-gesture-handler';

const setOrderDetails = ({masterCart, account}) => {    

    const {id, displayName, confirmationEmail, supplierContact} = account
    //APPEND ACCOUNT DETAILS TO ORDER
    return masterCart
    .map(supplierOrder => 
        {
            return (
                {
                    accountId: id,
                    accountDisplayName : displayName,
                    accountConfirmationEmail: confirmationEmail,
                    supplierContact: {contact: supplierContact[supplierOrder.supplierId].contact, 
                                      contactType:supplierContact[supplierOrder.supplierId].supplierContactType},                                
                    ...supplierOrder
                })                        
    })
}

const calcTotalsAddSupplier = ({masterOrder, supplierDetail}) => {   
    //CALCULATE TOTALS AND DELIVERY FEES FOR ORDER BASED ON ITEMS AND ORDER MINIMUMS             
     return  masterOrder.map((supplierOrder, index) => {
        //  const orderTotal = supplierOrder.cart.reduce((item,total) => item.price*item.quantity + total, 0)
        const orderTotal = 100
         console.log('CaLCED ORDER TOTAL')
         console.log(orderTotal)         
         let deliveryFee = 0
         if (orderTotal < supplierDetail[index].orderMinimum) {deliveryFee = supplierDetail[index].deliveryFee}
         return (
             {...supplierOrder, supplierDetail: supplierDetail[index],
                 orderTotal: orderTotal + deliveryFee,
                 deliveryFee: deliveryFee                
             }
         )
     })
 }

export class CartScreen extends React.Component {

    constructor(props) {
        super(props)

        console.log('PROPS')
        console.log(this.props)

        this.state = {
            getSuppliersLoading: true,
            supplierDetail: [],
            masterOrder: setOrderDetails(this.props),
            getSuppliersError: false,
            placeOrderLoading: Array(100).fill(false),
            placeOrderError: Array(100).fill(false),
            banner: { show: true, type: '', message: 'Banner' },

        }

        this.updateOrderDetails = this.updateOrderDetails.bind(this)
        this.hideBanner = this.hideBanner.bind(this)
        this.placeOrder = this.placeOrder.bind(this)
        this.pullSuppliersAndSetOrders = this.pullSuppliersAndSetOrders.bind(this)
    }

    updateOrderDetails = ({ index, update }) => {
        console.log('Running order detail updates')
        //HANDLE PASSING UP OF ORDER DETAILS FROM CHILD SUPPLIER CARTS (SHIPPING DAY & SHIPPING TIME)
        const newMasterOrder = [...this.state.masterOrder]
        newMasterOrder[index] = { ...this.state.masterOrder[index], ...update }
        this.setState({ masterOrder: newMasterOrder })
    }

    pullSuppliersAndSetOrders = async () => {
        const suppliers = this.props.masterCart.map(supplierCart => {
            return supplierCart.supplierId
        })
        try {
            const supplierDetail = await getCartSuppliers({ suppliers: suppliers })
            console.log(supplierDetail)
            this.setState({
                supplierDetail: supplierDetail,
                getSuppliersLoading: false,
                masterOrder: setOrderDetails({
                    masterCart: calcTotalsAddSupplier({ masterOrder: this.props.masterCart, supplierDetail: supplierDetail }),
                    account: this.props.account
                })
            })
        }
        catch (error) {
            console.log(error)
            this.setState({
                getSuppliersLoading: false,
                getSupplierError: true
            })
        }
    }

    hideBanner = () => {
        this.setState({ banner: { ...this.state.banner, show: false } })
    }

    placeOrder = async ({ index, supplierOrder }) => {

        console.log('RUNNING PLACE ORDER')
        console.log(index)
        console.log((index))
        console.log((supplierOrder))
        
        let order = {}
        if (supplierOrder) {
            order = { ...supplierOrder }
        } else {
            console.log('Place Order' + index)
            order = { ...this.state.masterOrder[index] }
        } 

        console.log('SELECTED ORDER')
        console.log(order)

        //set current order baed on index
        console.log("PLACING ORDER")
        console.log(order)
        console.log(!order.selectedDeliveryDate)
        console.log(!order.selectedDeliveryTimeSlot)
        //check that shipping is selected => if not - show banner error message   

        if (!order.selectedDeliveryDate || !order.selectedDeliveryTimeSlot) {
            this.setState({
                banner: { show: true, type: 'error', message: 'Please select a delivery date and time for' + order.supplierId }
            })
            return null
        }

        console.log('Running rest of place order')
        //set state to loading (pass state down?)
        order = { ...order, placingOrder: true }
        let newMasterOrder = [...this.state.masterOrder] //NEED TO DO THESE 2 LINES THIS EVERYTIME TO TRIGGER RERENDER       
        newMasterOrder[index] = order
        this.setState({
            masterOrder: newMasterOrder
        })

        //write to db & send email
        try {
            const response = await placeOrder({ supplierOrder: order })
            console.log(response)
            const body = response.data
            console.log('Success')
            this.props.removeOrderedCart(order.supplierId)
            this.setState({
                banner: {
                    show: true, type: 'success',
                    message: 'Your order to ' + order.supplierId + 'was placed!'
                }
            })
        } catch (err) { //500 error means that email has not yet been sent - let user try again. That means you need to clean duplicate carts from db.
            console.log(err)
            this.setState({
                banner: {
                    show: true, type: 'error',
                    message: 'There was an issue processing your order. Please try again. If the error persists please contact support.'
                }
            })
        }
        return null
    }

    placeFullOrder = async () => {
        const initOrders = [...this.state.masterOrder]
        for (let i = 0; i < initOrders.length; i++) {
            console.log('PLACINR ORDER TO ' + initOrders[i].supplierId)
            this.placeOrder({ supplierOrder: initOrders[i] })
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        console.log("Firing Componetn did update")

        if (!_.isEqual(prevProps.masterCart, this.props.masterCart)) {
            const firstCartPull = (prevProps.masterCart.length === 0 && this.props.masterCart.length !== 0)
            const supplierListChanged = (prevProps.masterCart.length !== this.props.masterCart.length)
            console.log("Seeing Change")
            if (firstCartPull || supplierListChanged) {
                console.log("UPDATING WITH SUPPLIER CHANGED")
                return await this.pullSuppliersAndSetOrders()
            } else {
                console.log(this.props.masterCart)
                this.setState({                           
                    masterOrder: setOrderDetails(
                        {masterCart: calcTotalsAddSupplier(
                            {masterOrder: this.props.masterCart,supplierDetail: this.state.supplierDetail}), 
                                                 account: this.props.account})            
                })  
                console.log('only cart item change')                
                console.log(this.props.masterCart)
            }

        }


    }

    async componentDidMount() {
        //if firebase cart hasn't been gotten - don't bother calling:
        if (this.props.masterCart.length === 0) {
            //HANLDE NO CART?
            return
        } else {
            console.log("RUNNIGN MOUNT")
            return await this.pullSuppliersAndSetOrders()
        }
    }

    render() {
        const { navigation } = this.props
        return (
            <>
                <ScrollView style={[commonStyles.container,]} showsVerticalScrollIndicator={false}>
            {/* <View style={[commonStyles.container, { flex: 1, paddingBottom: 70 }]}> */}
                <Banner banner={this.state.banner} hideBanner={this.hideBanner} />
                {/*
                 <Button 
                      title   = "Go Back"
                      onPress = {() => navigation.navigate('OrderScreen')}
                /> 
                <Text>Cart</Text>
               */}
                    {
                        this.state.masterOrder.map((supplierOrder, index) => {
                            return (
                                <View key={index} style={{ flex: 1, flexDirection: 'column', marginBottom: 5, justifyContent: "flex-start",paddingBottom:80 }}>
                                    {/* <Text style={styles.text}>Supplier </Text> */}
                                    <SupplierCart
                                        navigation={navigation}
                                        supplierOrder={supplierOrder}
                                        getSupplierLoading={this.state.getSuppliersLoading}
                                        supplierDetail={this.state.supplierDetail[index]}
                                        index={index}
                                        placeOrder={this.placeOrder}
                                        updateOrderDetails={this.updateOrderDetails}
                                    />
                                </View>
                            )
                        })}

                </ScrollView>
                <View style={{ position: 'absolute',bottom:0, flex: 1, alignSelf: 'center',width:'100%' }}>
                    <AppButton
                     style= {{marginHorizontal:10}}
                        text="Place Full Order"
                        onPress={this.placeFullOrder}
                    />
                </View>
            </>
        )
    }
}

const mapStateToProps = state => {
    return (
        {
            masterCart: state.cartState.masterCart,
            account: state.accountState.account
        }
    )
}

const mapDispatchToProps = dispatch => {
    return { removeOrderedCart: supplierId => dispatch(actions.removeOrderedCart(supplierId)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen)

const styles = StyleSheet.create({

})


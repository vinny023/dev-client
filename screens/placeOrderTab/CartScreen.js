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
import AppButton from '../../components/Global/AppButton';
import { Ionicons } from '@expo/vector-icons';
//import { TouchableOpacity } from 'react-native-gesture-handler';

const setOrderDetails = ({ masterCart, account }) => {

    const { id, displayName, confirmationEmail, supplierContact,deliveryLocations } = account
    //APPEND ACCOUNT DETAILS TO ORDER
    return masterCart
        .map(supplierOrder => {
            console.log(supplierOrder.supplierId)
            return (
                {
                    accountId: id,
                    accountDisplayName: displayName,
                    accountConfirmationEmail: confirmationEmail,
                    //ONLY HANDLE SINGLE DELIVERY LOCATION FOR NOW
                    deliveryLocation: deliveryLocations[0],
                    supplierContact: {
                        contact: supplierContact[supplierOrder.supplierId].contact,
                        contactType: supplierContact[supplierOrder.supplierId].supplierContactType
                    },
                    ...supplierOrder
                })
        })
}

const calcTotalsAddSupplier = ({ masterOrder, supplierDetail }) => {
    //CALCULATE TOTALS AND DELIVERY FEES FOR ORDER BASED ON ITEMS AND ORDER MINIMUMS             
    return masterOrder.map((supplierOrder, index) => {        
        let total = 0;
        supplierOrder.cart.forEach(item => item.price ? total = total + item.price*item.quantity : total = total)

        console.log('CaLCED ORDER TOTAL')
        console.log(total)

        return (
            {
                ...supplierOrder, supplierDetail: supplierDetail[index],
                orderTotal: total + supplierDetail[index].deliveryFee,
                deliveryFee: supplierDetail[index].deliveryFee
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
            banner: { show: false, type: '', message: '' },

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
                banner: {show:true,type:'error', message: 'Issue loading suppliers. Please exit cart and come back.' },
                getSuppliersLoading: false,
                getSupplierError: true
            })
        }
    }

    hideBanner = () => {
        this.setState({ banner: { ...this.state.banner, show: false } })
    }

    bannerAction = (action, actionParam) => {
        switch (action) {
            case 'placeBelowMinimumOrder':            
            this.setState({banner: {
                show: true, type: 'message',
                message: 'Placing order to ' + actionParam.supplierOrder.supplierDetail.displayName
            }})
            this.placeOrder(actionParam)
        }
    }


    placeOrder = async ({ index, supplierOrder, fullOrder }) => {

         
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
            setTimeout(() => {}, 2000)
       
            return null
        }

        //check if order total is less than minimum

        console.log('ORDER TOTALS');
        console.log(order.orderTotal);
        console.log(order.supplierDetail.orderMinimum);
        console.log((order.orderTotal < order.supplierDetail.orderMinimum));

        if (order.orderTotal < order.supplierDetail.orderMinimum && !order.confirmBelowMinimum) {
            this.setState({
                banner: {show: true, 
                        type: 'error', 
                        message: order.supplierDetail.displayName+' order total less than minimum. Tap here to confirm place order anyway',
                        action: 'placeBelowMinimumOrder',
                        duration: 2500,
                        actionParam: {supplierOrder: {...order, confirmBelowMinimum: true}}
                    }
            })
            setTimeout(() => {}, 2000)
          
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
            if (!fullOrder) { //don't show individual order banners when placing full order
            this.setState({
                banner: {
                    show: true, type: 'message',
                    message: 'Placing order to ' + order.supplierDetail.displayName
                }
            })
        }
            const response = await placeOrder({ supplierOrder: order })
            console.log(response)
            const body = response.data
            console.log('Success')
           
            // this.props.removeOrderedCart(order.supplierId)

            if (!fullOrder) {
            this.setState({ //don't show individual order banners when placing full order
                banner: {
                    show: true, type: 'success',
                    message: 'Your order to ' + order.supplierDetail.displayName + ' was placed!'
                }
            })
        }

        return order.supplierDetail.displayName

        } catch (err) { //500 error means that email has not yet been sent - let user try again. That means you need to clean duplicate carts from db.
            console.log(err)
            this.setState({
                banner: {
                    show: true, type: 'error',
                    message: 'There was an issue processing your order. Please try again. If the error persists please contact support.'
                }
            })
        }

        setTimeout(() => {}, 2000)
        
        return null
 
    }

    placeFullOrder = async () => {
        const initOrders = [...this.state.masterOrder]
        let ordersPlaced = [];
        console.log('Starting place full order');

        let bannerString = 'Placing order to '+initOrders.map(order => order.supplierDetail.displayName).join(', ')
        bannerString = bannerString.slice(0, bannerString.lastIndexOf(', '))+ ' and ' + bannerString.slice(bannerString.lastIndexOf(', ')+2, bannerString.length)

        this.setState({ //don't show individual order banners when placing full order
            banner: {
                show: true, type: 'message',
                message: bannerString,
                duration: 2500
            }
        })
        for (let i = 0; i < initOrders.length; i++) {
            console.log('PLACINR ORDER TO ' + initOrders[i].supplierId)
            let successSupplier = await this.placeOrder({ supplierOrder: initOrders[i] , fullOrder: true})
            if (successSupplier) {
                ordersPlaced.push(successSupplier);
            }
            console.log('first place order done')

            setTimeout(() => console.log('Running next place order'), 2000)
        }

           bannerString = 'Placed order to '+ordersPlaced.join(', ')+'!',
           bannerString = bannerString.slice(0, bannerString.lastIndexOf(', '))+ ' and ' + bannerString.slice(bannerString.lastIndexOf(', ')+2, bannerString.length)
           this.setState({ //don't show individual order banners when placing full order
                banner: {
                    show: true, type: 'success',
                    message: bannerString,
                    duration: 2500
                }
            })
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
                        {
                            masterCart: calcTotalsAddSupplier(
                                { masterOrder: this.props.masterCart, supplierDetail: this.state.supplierDetail }),
                            account: this.props.account
                        })
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
                {this.state.masterOrder.length > 0 ?
                    <>
                        <ScrollView style={[commonStyles.container]} showsVerticalScrollIndicator={false}>
                            {/* <View style={[commonStyles.container, { flex: 1, paddingBottom: 70 }]}> */}
                            <Banner banner={this.state.banner} hideBanner={this.hideBanner} bannerAction={this.bannerAction} />
                            {/*
                 <Button 
                      title   = "Go Back"
                      onPress = {() => navigation.navigate('OrderScreen')}
                /> 
                <Text>Cart</Text>
               */}
                            <View style={{ paddingBottom: 80 }}>
                                {
                                    this.state.masterOrder.map((supplierOrder, index) => {

                                        // console.log('PASSING IN SUPPLIER DETAIL')
                                        // console.log(this.state.supplierDetail[index])
                                        return (
                                            <View key={index} style={{ flex: 1, flexDirection: 'column', marginBottom: 5, justifyContent: "flex-start", }}>
                                                {/* <Text style={styles.text}>Supplier </Text> */}
                                                <SupplierCart
                                                    navigation={navigation}
                                                    supplierOrder={supplierOrder}
                                                    getSupplierLoading={this.state.getSuppliersLoading}
                                                    supplierDetail={this.state.supplierDetail[index]}
                                                    index={index}
                                                    placeOrder={this.placeOrder}
                                                    updateOrderDetails={this.updateOrderDetails}
                                                    supplierDeliverySettings={this.props.account.supplierDeliverySettings[supplierOrder.supplierId]}
                                                />
                                            </View>
                                        )
                                    })}
                            </View>
                        </ScrollView>
                        <View style={{ position: 'absolute', bottom: 0, flex: 1, alignSelf: 'center', width: '100%',backgroundColor:'rgba(255,255,255,.3)'}}>
                            {this.state.masterOrder.length > 1 &&
                                <AppButton
                                    style={[commonStyles.shadow,{marginHorizontal:20}]}
                                    text={"Checkout All "+this.state.masterOrder.length +" Vendors ($"+this.state.masterOrder.reduce((total, order) => total + order.orderTotal, 0).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")"}                                    onPress={this.placeFullOrder}
                                />
                            }
                        </View>
                    </>
                    :
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:30}}>
                        <Text style={[commonStyles.lightText, { textAlign: 'center' }]}>No items in cart. Go back to browse or manage existing orders.</Text>
                        <AppButton  text="Browse Products" onPress={()=>this.props.navigation.navigate('OrderScreen')} style={{width:'100%'}} />
                        <AppButton  text="Manage Orders" onPress={()=>this.props.navigation.navigate('ViewOrderScreen')} style={{width:'100%',marginTop:0}} />
                    </View>
                }
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


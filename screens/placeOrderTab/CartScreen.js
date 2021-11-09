import React from 'react';
import { connect } from 'react-redux'
import { Text, View, Image, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
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
import Modal from 'react-native-modal'
import { RadioButton } from 'react-native-paper'

//import { TouchableOpacity } from 'react-native-gesture-handler';

const createDaySelection = ({ DoW, shippingCutoff, shippingDays }) => {


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

    //if it fits the category - in DoW and within 7 days
    const returnVal = next7.filter((val, i) => DoW.indexOf(val.getDay()) !== -1 && val.getTime() - now.getTime() < 7 * millisecondsInDays)
        .map((val, i) => {
            return { day: daysOfWeek[val.getDay()], date: (val.getMonth() + 1).toString() + '/' + val.getDate() }
        })

    return returnVal
}

let justPlaced = false;

export class CartScreen extends React.Component {

    constructor(props) {
        super(props)

        //// console.log('PROPS')
        //// console.log(this.props)

        this.state = {
            getSuppliersLoading: true,
            supplierDetail: [],
            masterOrder: this.props.masterCart,            
            getSuppliersError: false,
            placeOrderLoading: Array(100).fill(false),
            placeOrderError: Array(100).fill(false),
            banner: { show: false, type: '', message: '' },
            placingFullOrder: false,
            showFilterModal: false,
            supplierFilter: []

        }

        // this.updateOrderDetails = this.updateOrderDetails.bind(this)
        this.hideBanner = this.hideBanner.bind(this)
        this.placeOrder = this.placeOrder.bind(this)
        this.pullSuppliersAndSetOrders = this.pullSuppliersAndSetOrders.bind(this)
    }

    // updateOrderDetails = ({ index, update }) => {
    //     //// console.log('Running order detail updates')
    //     //HANDLE PASSING UP OF ORDER DETAILS FROM CHILD SUPPLIER CARTS (SHIPPING DAY & SHIPPING TIME)
    //     const newMasterOrder = [...this.state.masterOrder]
    //     newMasterOrder[index] = { ...this.state.masterOrder[index], ...update }
    //     this.setState({ masterOrder: newMasterOrder })
    // }

    setOrderDetails = ({ masterCart, account, supplierDetail }) => {

        const { id, displayName, confirmationEmail, supplierContact,deliveryLocations } = account
        //APPEND ACCOUNT DETAILS TO ORDER

        let bulkOrderUpdate = []

        let masterOrder = masterCart.map((supplierOrder, i) => {
        
            const dateUpdate = this.setDefaultDelivery({
                account:account,
                supplierOrder:supplierOrder,
                supplierDetail:supplierDetail[i]
            })

             const accountUpdate = {
            
                     accountId: id,
                    accountDisplayName: displayName,
                    accountConfirmationEmail: confirmationEmail,
                    //ONLY HANDLE SINGLE DELIVERY LOCATION FOR NOW
                    deliveryLocation: deliveryLocations[0],
                    supplierContact: {
                        contact: supplierContact[supplierOrder.supplierId].contact,
                        contactType: supplierContact[supplierOrder.supplierId].supplierContactType,
                        
            
                    }}

                    // // console.log('DATE UPDATE');
                    // // console.log(dateUpdate);

                    bulkOrderUpdate.push({...accountUpdate, ...dateUpdate, ...supplierOrder, ...supplierDetail[i]})
                
                    // if (!supplierOrder.accountId) {

                                    // bulkAccountUpdate.push(supplierOrderUpdate)           
                            
                                // }

                return {...accountUpdate, ...dateUpdate, ...supplierOrder}
            })


            // // console.log('RUNNING BULK UPDATE FROM CART SCREEN - SET ORDER DETAIKLS');

            this.props.bulkUpdateOrderDetails({bulkUpdate: bulkOrderUpdate})

            return masterOrder
    }


    setDefaultDelivery = ({account, supplierDetail, supplierOrder}) => {

        if (supplierDetail) {

            // // console.log('SET DEFAULT DELIVERY SUPPLIER ORDER');
            // // console.log(supplierOrder);

            const { selectedDeliveryDate, selectedDeliveryTimeSlot } = supplierOrder

            // // console.log('ALREADY SET DELIVERY DATE & TIME');
            // // console.log(selectedDeliveryDate);
            // // console.log(selectedDeliveryTimeSlot);


            //this line aggregates shipping info from two sources, local account DELIVER SETTINGS & global supplier delivery settings
            const deliveryDays = createDaySelection({ DoW: account.supplierDeliverySettings[supplierOrder.supplierId].DoW, ...supplierDetail })

            // // console.log('DELIVERY DAYS');
            // // console.log(deliveryDays);

            let update = {}

            if (!selectedDeliveryDate && !selectedDeliveryTimeSlot) {
                update = {
                    selectedDeliveryDate: deliveryDays[0],
                    selectedDeliveryTimeSlot: account.supplierDeliverySettings[supplierOrder.supplierId].windows[0]
                }
            } else if (!selectedDeliveryTimeSlot) {
                update = { selectedDeliveryTimeSlot: account.supplierDeliverySettings[supplierOrder.supplierId].windows[0] }
            } else if (!selectedDeliveryDate) {
                update = { selectedDeliveryDate: deliveryDays[0] }
            } else if (selectedDeliveryDate) {
                //if dates are selected - make sure they are in range - if not set as default
                let selectedDateInRange = false
                for (const day in deliveryDays) {


                    if (_.isEqual(selectedDeliveryDate, deliveryDays[day])) {
                        selectedDateInRange = true
                    }
                }
                if (!selectedDateInRange) {
                    // // console.log('OPTION 2');

                    
                    // // console.log('********CHECK THIS COMAIRPSIN*************');
                    // // console.log(selectedDeliveryDate);
                    // // console.log(day);
                    // // console.log(deliveryDays);
                    // // console.log(deliveryDays[day]);
                    
                    update = { selectedDeliveryDate: deliveryDays[0], }
                }

            }

            return update

            // if ((!selectedDeliveryDate || !selectedDeliveryTimeSlot)) {
            //     return update
            // } else {
            //     return {}
            // }
        }
    }
    
    calcTotalsAddSupplier = ({ masterOrder, supplierDetail }) => {
        //CALCULATE TOTALS AND DELIVERY FEES FOR ORDER BASED ON ITEMS AND ORDER MINIMUMS             
        return masterOrder.map((supplierOrder, index) => {        
            let total = 0;
            supplierOrder.cart.forEach(item => item.price ? total = total + item.price*item.quantity : total = total)



            if (supplierDetail.length !== 0) {

                // WRITE TO FIREBASE?;
                // this.props.updateOrderDetails({ supplierId: supplierOrder.supplierId, update: { supplierDetail: supplierDetail[index],
                //     orderTotal: total + supplierDetail[index].deliveryFee,
                //     deliveryFee: supplierDetail[index].deliveryFee   } })            

                    return (
                        {
                            ...supplierOrder, supplierDetail: supplierDetail[index],
                            orderTotal: total + supplierDetail[index].deliveryFee,
                            deliveryFee: supplierDetail[index].deliveryFee
                        }
                    )
            } else {
                return supplierOrder
            }
            
    
    
        })
    }

    pullSuppliersAndSetOrders = async () => {
        const suppliers = this.props.masterCart.map(supplierCart => {
            return supplierCart.supplierId
        })
        try {
            const supplierDetail = await getCartSuppliers({ suppliers: suppliers })

            //// console.log(supplierDetail)
            this.setState({
                supplierDetail: supplierDetail,
                getSuppliersLoading: false,    
                masterOrder: this.setOrderDetails({
                    masterCart: this.props.masterCart,
                    // masterCart: this.calcTotalsAddSupplier({ masterOrder: this.props.masterCart, supplierDetail: supplierDetail }),
                    account: this.props.account,
                    supplierDetail: supplierDetail
                })        
           
               
            })



            
        }
        catch (error) {
            //// console.log(error)
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
                message: 'Placing order to ' + actionParam.supplierOrder.displayName
            }})
            this.placeOrder(actionParam)
        }
    }


    placeOrder = async ({ index, supplierOrder, fullOrder }) => {

         
        //// console.log('RUNNING PLACE ORDER')
        //// console.log(index)
        //// console.log((index))
        //// console.log((supplierOrder))

        let order = {}
        if (supplierOrder) {
            order = { ...supplierOrder }
        } else {
            //// console.log('Place Order' + index)
            order = { ...this.props.masterCart[index] }
        }

        //// console.log('SELECTED ORDER')
        //// console.log(order)

        //set current order baed on index
        //// console.log("PLACING ORDER")
        //// console.log(order)
        //// console.log(!order.selectedDeliveryDate)
        //// console.log(!order.selectedDeliveryTimeSlot)
        //check that shipping is selected => if not - show banner error message   

        if (!order.selectedDeliveryDate || !order.selectedDeliveryTimeSlot) {
            this.setState({
                banner: { show: true, type: 'error', message: 'Please select a delivery date and time for ' + order.displayName }
            })
            setTimeout(() => {}, 2000)
       
            return null
        }

        //check if order total is less than minimum
        let total = 0;
        order.cart.forEach(item => item.price ? total = total + item.price*item.quantity : total = total)
        order.orderTotal = total+order.deliveryFee

        //// console.log('ORDER TOTALS');
        //// console.log(order.orderTotal);
        //// console.log(order.supplierDetail.orderMinimum);
        //// console.log((order.orderTotal < order.supplierDetail.orderMinimum));

        if (total !== 0 && total < order.orderMinimum && !order.confirmBelowMinimum) {
            this.setState({
                banner: {show: true, 
                        type: 'error', 
                        message: order.displayName+' order total less than minimum. Tap here to confirm place order anyway',
                        action: 'placeBelowMinimumOrder',
                        duration: 2500,
                        actionParam: {supplierOrder: {...order, confirmBelowMinimum: true}}
                    }
            })
            setTimeout(() => {}, 2000)
          
           return null
        }

        //// console.log('Running rest of place order')
        //set state to loading (pass state down?)
        // order = { ...order, placingOrder: true }
        // let newMasterOrder = [...this.state.masterOrder] //NEED TO DO THESE 2 LINES THIS EVERYTIME TO TRIGGER RERENDER       
        // newMasterOrder[index] = order
        // this.setState({
        //     masterOrder: this.props.masterCart
        // })

        //write to db & send email
        try {
            if (!fullOrder) { //don't show individual order banners when placing full order
                
                // console.log('running banner set state')
                this.setState({
                banner: {
                    show: true, type: 'message',
                    message: 'Placing order to ' + order.displayName
                }
            })
        }
            const response = await placeOrder({ supplierOrder: order })
            //// console.log(response)
            const body = response.data
            //// console.log('Success')
           
            justPlaced = true;

            this.props.removeOrderedCart({supplierId: order.supplierId})

            
            // console.log('FUll ORDER');
            // console.log(fullOrder);
        // console.log((!fullOrder));

            if (!fullOrder) {
                // console.log('TRYING TO SHOW SUCCESS');
            this.setState({ //don't show individual order banners when placing full order
                banner: {
                    show: true, type: 'success',
                    message: 'Your order to ' + order.displayName + ' was placed!'
                }
            })
        }


        return order.displayName

        } catch (err) { //500 error means that email has not yet been sent - let user try again. That means you need to clean duplicate carts from db.
            // console.log(err)
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
        //// console.log('Starting place full order');

        // let bannerString = 'Placing order to '+initOrders.map(order => order.displayName).join(', ')
        // bannerString = bannerString.slice(0, bannerString.lastIndexOf(', '))+ ' and ' + bannerString.slice(bannerString.lastIndexOf(', ')+2, bannerString.length)

        let bannerString = 'Placing order to '+initOrders.length+" suppliers"
        this.setState({ //don't show individual order banners when placing full order
            placingFullOrder: true,
            banner: {
                show: true, type: 'message',
                message: bannerString,
                duration: 2500
            }
        })
        for (let i = 0; i < initOrders.length; i++) {
            //// console.log('PLACINR ORDER TO ' + initOrders[i].supplierId)
            let successSupplier = await this.placeOrder({ supplierOrder: initOrders[i] , fullOrder: true})
            if (successSupplier) {
                ordersPlaced.push(successSupplier);
            }
            //// console.log('first place order done')

            // setTimeout(() => //// console.log('Running next place order'), 2000)
        }
           if (ordersPlaced.length === 0) {
            // this.setState({ //don't show individual order banners when placing full order
            //     banner: {
            //         show: true, type: 'error',
            //         message: 'Orders not placed. Please try again or place orders individually.',
            //         duration: 2500
            //     }
            // })
            
           } else {
        
           bannerString = 'Placed order to all suppliers!'
        //    bannerString = bannerString.slice(0, bannerString.lastIndexOf(', '))+ ' and ' + bannerString.slice(bannerString.lastIndexOf(', ')+2, bannerString.length)
           this.setState({ //don't show individual order banners when placing full order
                placingFullOrder: false,
                banner: {
                    show: true, type: 'success',
                    message: bannerString,
                    duration: 2500
                }
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        const firstCartPull = (this.props.masterCart.length === 0 && nextProps.masterCart.length !== 0)
        const supplierListChanged = (this.props.masterCart.length !== nextProps.masterCart.length)

        // console.log('CART SHOULD cOMPOENT UPDATE');
        // console.log(nextProps.masterCart);
        // console.log(this.props.masterCart);
        // console.log(this.state);
        // console.log(nextState.placingFullOrder);
        // console.log(justPlaced);


        return (!_.isEqual(nextProps.masterCart, this.props.masterCart) && 
        ((firstCartPull || supplierListChanged) && !nextState.placingFullOrder && !justPlaced) || !_.isEqual(nextState, this.state) || 
        nextProps.masterCart.length === 0 && this.state.placingFullOrder)

    }

    async componentDidUpdate(prevProps, prevState) {   
        
 

        if (!_.isEqual(prevProps.masterCart, this.props.masterCart)) {
            const firstCartPull = (prevProps.masterCart.length === 0 && this.props.masterCart.length !== 0)
            const supplierListChanged = (prevProps.masterCart.length !== this.props.masterCart.length)
            //// console.log("Seeing Change")
            if ((firstCartPull || supplierListChanged) && !this.state.placingFullOrder && !justPlaced) {
                // console.log("UPDATING WITH SUPPLIER CHANGED")
                // console.log(justPlaced);
                return await this.pullSuppliersAndSetOrders()
            } else if (justPlaced){
                justPlaced = false;
            

                //IF THE QUNATITY HAS CHANGED I ONLY NEED TO UPDATE THAT CARTS ORDER DETAILS

                //// console.log(this.props.masterCart)

                // // console.log('REREDING CART ON UPDATE');
                // // console.log(prevProps.masterCart);
                // // console.log(this.props.masterCart)
                // // console.log(this.state.masterOrder)
            
                //I NEED THIS TO FORCE A RESET ON CART CHANGES?
                // this.setState({
                //     masterOrder: this.calcTotalsAddSupplier({
                //         masterOrder: this.props.masterCart, supplierDetail: this.state.supplierDetail
                //     })
                // })

            //*MAYBE RAPLCE 10-27
                //  this.setState({
            //    masterOrder: this.setOrderDetails(
            //         {
            //             masterCart: this.calcTotalsAddSupplier(
            //                 { masterOrder: this.props.masterCart, supplierDetail: this.state.supplierDetail }),
            //             account: this.props.account
            //         })

            //  })
                //// console.log('only cart item change')
                //// console.log(this.props.masterCart)
            }

        }

    }

    async componentDidMount() {
        //if firebase cart hasn't been gotten - don't bother calling:


        // console.log('CART SCREENDID MOUNT SUPPLIER DETAIL');

        // console.log('RUNNIGNG CART SCREEN DID MOUNT');
        // console.log(this.state);

        if (this.props.masterCart.length === 0 || this.state.supplierDetail.length > 0) {
            //HANLDE NO CART?
            return
        } else {
            // console.log("RUNNIGN MOUNT")
            return await this.pullSuppliersAndSetOrders()
        }
    }

    handleFilterUpdate = (newSupplier) => {
        // console.log('running filter update')
        // console.log(newSupplier);
        const index = this.state.supplierFilter.indexOf(newSupplier)
        let newSupplierFilter = []
        if (index === -1) {
            newSupplierFilter = [...this.state.supplierFilter, newSupplier]            
        } else {
            newSupplierFilter = [...this.state.supplierFilter]
            newSupplierFilter.splice(index, 1)
        }
        this.setState({
            supplierFilter: newSupplierFilter,
        })
        // // console.log(this.state.supplierFilter)

        // console.log(newSupplierFilter);
    }  


    render() {

        // console.log('RErendering Cart Screeh');
        const {showFilterModal, supplierFilter} = this.state

        // let cartDollarAmount = this.state.masterOrder.reduce((total, order) => total + order.orderTotal, 0)
        // let masterCheckoutStringEnd = "($"+cartDollarAmount.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+")"
        // if (cartDollarAmount === 0) {            
        //     //if no dollar amounts - show number of items
        //     masterCheckoutStringEnd = "("+this.state.masterOrder.reduce((total, order) => total + order.cart.reduce((cartTotal, item) => cartTotal + item.quantity, 0),0) +" items)"
        // }    



        let masterCheckoutString = "Loading"
        if (this.props.masterCart) {
            masterCheckoutString = "Checkout All "+this.props.masterCart.length +" Suppliers "

        }

        
        const { navigation } = this.props
        return (
            <>
            <Banner banner={this.state.banner} hideBanner={this.hideBanner} bannerAction={this.bannerAction} />
                {this.props.masterCart.length > 0 ?
                    <>
                        <ScrollView style={[commonStyles.container]} showsVerticalScrollIndicator={false}>
                            {/* <View style={[commonStyles.container, { flex: 1, paddingBottom: 70 }]}> */}
                           
                            {/*
                 <Button 
                      title   = "Go Back"
                      onPress = {() => navigation.navigate('OrderScreen')}
                /> 
                <Text>Cart</Text>
               */}



                  {/*SUPPLIER FILTER MODAL */}

               <Modal
               isVisible={this.state.showFilterModal}
               animationType="slide"
               backdropOpacity={.5}
               style={commonStyles.modalView}
           >
               <View style={[commonStyles.centeredView, { paddingTop: 40, padding: 20 }]}>
                   <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                       <TouchableOpacity style={{ alignSelf: 'flex-start', paddingBottom: 15 }} onPress={() => this.setState({ showFilterModal: false })} >
                           <Ionicons name='close' size={sizes.s20} />
                       </TouchableOpacity>
                       <TouchableOpacity onPress={() => this.setState({ supplierFilter: [], showFilterModal: false})}>
                       <Text style={[commonStyles.lightText, { color: colors.blue.primary }]}>Clear Filter</Text>
                       </TouchableOpacity>
                   </View>
                   <View>
                       <Text style={{ fontSize: sizes.s20 + 2, fontFamily: 'bold', color: colors.text, }}>Filter Orders</Text>
                   </View>

                   <View style={{ paddingTop: 20 }}>
                       <Text style={[commonStyles.lightHeading, { fontSize: sizes.s15 }]}>Filter by supplier</Text>
                   </View>
                   <ScrollView style={[commonStyles.card, { padding: 5,marginTop:7, paddingBottom: 40 }]}>
                       {!!this.props.masterCart[0].displayName && this.props.masterCart.map(supplier => {
                           // // console.log(supplier)
                           //CHECK IF SELECTED
                           let selected = false;
                           if (supplierFilter.indexOf(supplier.displayName) !== -1) {
                               selected = true;
                           }
                           return (
                               <TouchableOpacity onPress={() => this.handleFilterUpdate(supplier.displayName)} style={[commonStyles.row, { paddingVertical: 3 }]}>

                                   <RadioButton
                                       //value={label}
                                       //label={label}
                                       uncheckedColor={'#E6F0FD'}
                                       color={colors.blue.primary}
                                       status={supplierFilter.indexOf(supplier.displayName) !== -1 ? 'checked' : 'unchecked'}
                                       onPress={() => this.handleFilterUpdate(supplier.displayName)}
                                   />
                                   <View>
                                       <Text style={commonStyles.text}>{supplier.displayName}</Text>
                                   </View>
                               </TouchableOpacity>
                           )
                       })
                       }
                   </ScrollView>
                   <View style={{ flex: 1, justifyContent: 'flex-end' }}>

                       <AppButton text="Apply" onPress={() => this.setState({ showFilterModal: false })} style={[commonStyles.shadow,{ marginVertical: 0, }]} />
                   </View>
               </View>
           </Modal>


           <TouchableOpacity onPress={() => this.setState({ showFilterModal: true })} style={{ paddingRight: 10 }}>
           <Text style={{ color: colors.blue.primary, fontSize: sizes.s15, fontFamily: 'regular', alignSelf: 'flex-end' }}>Filter By Supplier</Text>
       </TouchableOpacity>


            {/*START SHOWING SUPPLIER CARTS */}
                            <View style={{ paddingBottom: 80 }}>
                                {
                                    this.props.masterCart.map((supplierOrder, index) => {

                                        if (supplierFilter.length > 0 && supplierOrder.displayName && supplierFilter.indexOf(supplierOrder.displayName) === -1) {

                                            // console.log('MASTER CART LENGHT');
                                            // console.log(this.props.masterCart);
                                            // console.log(index);
                                            return (
                                                <></>
                                                )

                                        }

                                        // //// console.log('PASSING IN SUPPLIER DETAIL')
                                        // //// console.log(this.state.supplierDetail[index])
                                        return (
                                            <View key={index} style={{ flex: 1, flexDirection: 'column', marginBottom: 5, justifyContent: "flex-start", }}>
                                                {/* <Text style={styles.text}>Supplier </Text> */}
                                                <SupplierCart
                                                    navigation={navigation}
                                                    supplierOrder={supplierOrder}
                                                    getSupplierLoading={this.state.getSuppliersLoading}
                                                    supplierDetail={this.state.supplierDetail[index]}
                                                    index={index}
                                                    key={index}
                                                    placeOrder={this.placeOrder}
                                                    
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
                            style={[commonStyles.shadow,{ marginHorizontal: 20 }]}
                                text={masterCheckoutString}
                                onPress={this.placeFullOrder}
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
    return { removeOrderedCart: supplierId => dispatch(actions.removeOrderedCart(supplierId)),
              updateOrderDetails: params => dispatch(actions.updateOrderDetails(params)), 
            
              bulkUpdateOrderDetails: params => dispatch(actions.bulkUpdateOrderDetails(params)) 
            }
}



export default connect(mapStateToProps, mapDispatchToProps)(CartScreen)

const styles = StyleSheet.create({

})


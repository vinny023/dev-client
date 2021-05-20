import React from 'react'
import { connect } from 'react-redux'
import { Text, View, Image, Button, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { getOrders, setOrder } from '../../apis/apis'
import Banner from '../../components/Global/Banner'
//import * as Sentry from 'sentry-expo';
import { useNavigation } from '@react-navigation/native';
import { colors, commonStyles, sizes } from '../../theme'
import AppButton from '../../components/Global/AppButton'
import Modal from 'react-native-modal'
import { Ionicons } from '@expo/vector-icons'
import { RadioButton } from 'react-native-paper'


const OrderButton = ({ order }) => {

    const navigation = useNavigation()
    const orderTotal = order.cart.reduce((total, item) => total + item.price*item.quantity, 0) + order.deliveryFee
    return (
        <TouchableOpacity onPress={() => navigation.navigate('OrderDetailScreen', { order: order })} style={[commonStyles.row, { width: '100%', paddingRight: 7, }]} >
            {/* <AppButton
            text={order.supplierDetail.displayName}
            onPress={() => navigation.navigate('OrderDetailScreen', { order: order })}
        /> */}
            <Image source={{ uri: order.supplierDetail.logo }} style={{ width: 42, height: 42, marginRight: 10 }} />
            <View style={{ flex: 2, }}>

                <Text style={commonStyles.text}>{order.supplierDetail.displayName}</Text>
                <View style={{ marginBottom: 2 }} />
                <Text style={commonStyles.lightText}>{order.selectedDeliveryDate.day}: {order.selectedDeliveryTimeSlot}</Text>
            </View>
            <View style={[commonStyles.row, styles.priceContainer]}>
                
                {order.orderTotal &&
                    <View>
                    <Text style={[commonStyles.text, { fontSize: sizes.s16, textAlign: 'right' }]}>${orderTotal.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                    </View>
                }
            </View>
        </TouchableOpacity>
    )
}

class ViewOrderScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            supplierFilter: [],
            orderList: [],
            getOrdersLoading: false,
            getOrdersError: false,
            banner: { show: false, type: '', message: '', buttonAction: {} },
            showFilterModal: false,
            openOrders: [],
            deliveredOrders: []
            
        }
    }

    getOrders = async () => {  
            try {
                // console.log('RUNNING GET ORDERS');
                this.setState({ getOrdersLoading: true })

                const orders = await getOrders({ query: { accountId: this.props.account.accountId }, sort: { createdDate: -1 } })
                // console.log(orders);
                const {openOrders, deliveredOrders} = this.setFilteredOrders({orderList: orders.slice(0,10), supplierFilter: this.state.supplierFilter})           
                this.setState({
                    orderList: orders.slice(0,20),
                    getOrderLoading: false,
                    openOrders: openOrders,
                    deliveredOrders: deliveredOrders
                })
            }
            catch (error) {
                // console.log(error)               
                    //show errors if item is not loading, & try again
                    this.setState({
                        banner: {
                            show: true,
                            type: 'error',
                            message: 'Could not load orders. Please refresh. If error persists - please contact support.',
                            buttonAction: { 'title': 'Refresh', 'params': '' }
                        }
                    })
                    //Sentry.Native.captureException(error)
                    //log error with sentry                
            }       

    }

    hideBanner = () => {
        this.setState({ banner: { ...this.state.banner, show: false } })
    }

    handleFilterUpdate = (newSupplier) => {
        // console.log('running filter update')
        const index = this.state.supplierFilter.indexOf(newSupplier)
        let newSupplierFilter = []
        if (index === -1) {
            newSupplierFilter = [...this.state.supplierFilter, newSupplier]            
        } else {
            newSupplierFilter = [...this.state.supplierFilter]
            newSupplierFilter.splice(index, 1)
            this.setState({
                supplierFilter: newSupplierFilter
            })
        }
        const {openOrders, deliveredOrders} = this.setFilteredOrders({orderList: this.state.orderList, supplierFilter: newSupplierFilter})           
        this.setState({
            supplierFilter: newSupplierFilter,
            openOrders: openOrders,
            deliveredOrders: deliveredOrders
        })
        // console.log(this.state.supplierFilter)
    }  


    setFilteredOrders = ({orderList, supplierFilter}) => {
         

        let openOrders = []
        let deliveredOrders = []
        
        //group orders between open & completed, which sits on top of sorting 
        orderList.forEach(order => {
            if (supplierFilter.indexOf(order.supplierId) !== -1 || supplierFilter.length === 0) {
            if (order.status === 'Delivered') {
                deliveredOrders.push(order)
            } else {
                openOrders.push(order)               
            }
        }
        })

        // console.log('SUPPLIER FILTER');
        // console.log(supplierFilter);

        // console.log('OPEN ORDERS')
        // // console.log(openOrders)

        // console.log('DELIVERED ORDERS')
        // console.log(deliveredOrders)

        return {openOrders: openOrders, deliveredOrders: deliveredOrders}
    }

    async componentdidUpdate(prevProps, prevState) {

        console.log('ORDER SCREEN COMP DID UPDATE');

        if (prevProps.masterCart.length !== this.props.masterCart.length ) {
            await this.getOrders()
        }

    }

    async componentDidMount() {
        console.log('ORDER comp did mount');
        await this.getOrders()

        this.props.navigation.addListener(
            'focus',
            () => {
            console.log('ORDER running focus action');
              this.getOrders()
            }
          );

    }


    render() {

        const { supplierFilter, deliveredOrders, openOrders, orderList, showFilterModal } = this.state

        //filter by supplierFilter.
        // let renderOrderList = [...orderList]
        // if (supplierFilter.length > 0) {
        //     renderOrderList = orderList.filter(order => supplierFilter.indexOf(order.supplierDetail.displayName) !== -1)
        // }

        // console.log('FILTERED LIST')
        // console.log(renderOrderList)
        //group orders between open & completed, which sits on top of sorting 
 
        // renderOrderList.forEach(order => {
        //     if (order.status === 'Delivered') {
        //         deliveredOrders.push(order)

        //     } else {
        //         openOrders.push(order)
        //         // this.setState({})
        //     }
        // })

        // console.log('OPEN ORDERS')
        // console.log(openOrders)

        // console.log('DELIVERED ORDERS')
        // console.log(deliveredOrders)

        return (

            //show loading until orders has been pulled

            <ScrollView style={[commonStyles.container]}>
                <Banner banner={this.state.banner} hideBanner={this.hideBanner} />

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
                            <Text style={[commonStyles.lightText, { color: colors.blue.primary }]}>Reset</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: sizes.s20 + 2, fontFamily: 'bold', color: colors.text, }}>Filter Orders</Text>
                        </View>

                        <View style={{ paddingTop: 20 }}>
                            <Text style={[commonStyles.lightHeading, { fontSize: sizes.s15 }]}>Filter by supplier</Text>
                        </View>
                        <View style={[commonStyles.card, { padding: 5,marginTop:7 }]}>
                            {!!this.props.account.activeSuppliers && this.props.account.activeSuppliers.map(supplier => {
                                // console.log(supplier)
                                //CHECK IF SELECTED
                                let selected = false;
                                if (supplierFilter.indexOf(supplier) !== -1) {
                                    selected = true;
                                }
                                return (
                                    <TouchableOpacity onPress={() => this.handleFilterUpdate(supplier)} style={[commonStyles.row, { paddingVertical: 3 }]}>

                                        <RadioButton
                                            //value={label}
                                            //label={label}
                                            uncheckedColor={'#E6F0FD'}
                                            color={colors.blue.primary}
                                            status={supplierFilter.indexOf(supplier) !== -1 ? 'checked' : 'unchecked'}
                                            onPress={() => this.handleFilterUpdate(supplier)}
                                        />
                                        <View>
                                            <Text style={commonStyles.text}>{supplier}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                            }
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>

                            <AppButton text="Apply" onPress={() => this.setState({ showFilterModal: false })} style={[commonStyles.shadow,{ marginVertical: 0, }]} />
                        </View>
                    </View>
                </Modal>
                <View style={{ paddingBottom: 40, paddingTop: 5 }}>
                    {openOrders.length > 0 ?
                        <View>
                            <View style={[commonStyles.row, { paddingLeft: 10, justifyContent: 'space-between', paddingVertical: 0, paddingBottom: 3 }]}>
                                <Text style={[commonStyles.lightHeading,{fontSize:sizes.s15}]}>Open Orders</Text>
                                <TouchableOpacity onPress={() => this.setState({ showFilterModal: true })} style={{ paddingRight: 10 }}>
                                    <Text style={{ color: colors.blue.primary, fontSize: sizes.s15, fontFamily: 'regular', alignSelf: 'flex-end' }}>Filter Orders</Text>
                                </TouchableOpacity>
                            </View>
                            { //!this.state.getOrdersLoading ? <ActivityIndicator size="small" color={colors.blue.primary} style={{ alignSelf: 'center', marginTop: 70 }} />:
                            }
                            <ScrollView style={[commonStyles.card, { marginBottom: 20,paddingTop:4,marginTop:7 }]}>
                                {
                                    openOrders.map((order, i) => <OrderButton key={i} order={order} />)
                                    
                                }

                            </ScrollView>
                        </View>
                        : <ActivityIndicator size="small" color={colors.blue.primary} style={{ alignSelf: 'center', marginTop: 100 }} />

                    }
                    {deliveredOrders.length > 0 ?
                        <View>
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={[commonStyles.lightHeading,{fontSize:sizes.s15}]}>Delivered Orders</Text>
                            </View>
                            <ScrollView style={[commonStyles.card,{marginTop:7,paddingTop:7}]}>
                                {
                                     deliveredOrders.map((order, i) => <OrderButton key={i} order={order} />)
                                    
                                }
                                {/* <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
                                    <Text style={commonStyles.lightText}>No Orders Delivered yet</Text>
                                </View> */}
                            </ScrollView>
                        </View>
                        : <></>
                    }
                </View>
            </ScrollView>
        )


        //list of orders with button on press navigat to order with params
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

export default connect(mapStateToProps)(ViewOrderScreen)
const styles = StyleSheet.create({
    priceContainer: {
        paddingVertical: 0,
        alignSelf: 'flex-start',
        paddingLeft: 2,
        paddingTop: 7
    }
})
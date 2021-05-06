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
    return (
        <TouchableOpacity onPress={() => navigation.navigate('OrderDetailScreen', { order: order })} style={[commonStyles.row, { width: '100%', paddingRight: 10, }]} >
            {/* <AppButton
            text={order.supplierDetail.displayName}
            onPress={() => navigation.navigate('OrderDetailScreen', { order: order })}
        /> */}
            <Image source={require('../../assets/woolco.png')} style={{ width: 45, height: 45, marginRight: 10 }} />
            <View style={{ flex: 2, }}>
                <Text style={commonStyles.text}>{order.supplierDetail.displayName}</Text>
                <View style={{ marginBottom: 2 }} />
                <Text style={commonStyles.lightText}>{order.selectedDeliveryDate.day},{order.selectedDeliveryTimeSlot}</Text>
            </View>
            <Text style={[commonStyles.text, { fontSize: sizes.s16, flex: 0.8, textAlign: 'right' }]}>${order.supplierDetail.orderMinimum}</Text>
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
            showFilterModal: false
        }
    }

    getOrders = async () => {
        for (let i = 0; i < 3; i++) {
            try {
                console.log(i + ' ATTEMPT')
                this.setState({ getOrdersLoading: true })
                const orders = await getOrders({ query: { accountId: this.props.account.accountId }, sort: { createdDate: -1 } })
                this.setState({
                    orderList: orders,
                    getOrderLoading: false,
                })
                break;
            }
            catch (error) {
                console.log(error)
                if (i < 2) {
                    this.setState({
                        getOrdersLoading: false,
                        getOrdersError: true,
                        banner: { show: true, type: 'error', message: 'Issue loading orders - trying again.' }
                    })
                } else {
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
        }

    }

    hideBanner = () => {
        this.setState({ banner: { ...this.state.banner, show: false } })
    }

    handleFilterUpdate = (newSupplier) => {
        console.log('running filter update')
        const index = this.state.supplierFilter.indexOf(newSupplier)
        if (index === -1) {
            this.setState({
                supplierFilter: [...this.state.supplierFilter, newSupplier]
            })
        } else {
            let newSupplierFilter = [...this.state.supplierFilter]
            newSupplierFilter.splice(index, 1)
            this.setState({
                supplierFilter: newSupplierFilter
            })
        }
        console.log(this.state.supplierFilter)
    }

    //filters - status, supplier  



    async componentDidMount() {
        await this.getOrders()

    }


    render() {

        const { supplierFilter, orderList, showFilterModal } = this.state

        //filter by supplierFilter.
        let renderOrderList = [...orderList]
        if (supplierFilter.length > 0) {
            renderOrderList = orderList.filter(order => supplierFilter.indexOf(order.supplierDetail.displayName) !== -1)
        }

        console.log('FILTERED LIST')
        console.log(renderOrderList)

        //group orders between open & completed, which sits on top of sorting    
        let deliveredOrders = []
        let openOrders = []

        renderOrderList.forEach(order => {
            if (order.status === 'Delivered') {
                deliveredOrders.push(order)

            } else {
                openOrders.push(order)
                // this.setState({})
            }
        })

        console.log('OPEN ORDERS')
        console.log(openOrders)

        console.log('DELIVERED ORDERS')
        console.log(deliveredOrders)

        return (

            //show loading until orders has been pulled

            <ScrollView style={[commonStyles.container, { paddingHorizontal: 15 }]}>
                <Banner banner={this.state.banner} hideBanner={this.hideBanner} />
                <TouchableOpacity onPress={() => this.setState({ showFilterModal: true })} style={{ paddingRight: 10 }}>
                    <Text style={{ color: colors.blue.primary, fontSize: sizes.s15, fontFamily: 'regular', alignSelf: 'flex-end' }}>Filter & Sort</Text>
                </TouchableOpacity>
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
                       
                        <View style={{ paddingTop: 40 }}>
                            <Text style={[commonStyles.lightHeading, { fontSize: sizes.s15 }]}>Filter by supplier</Text>
                        </View>
                        <View style={[commonStyles.card]}>
                            {this.props.account.activeSuppliers.map(supplier => {
                                console.log(supplier)
                                //CHECK IF SELECTED
                                let selected = false;
                                if (supplierFilter.indexOf(supplier) !== -1) {
                                    selected = true;
                                }
                                return (
                                    <View style={commonStyles.row}>

                                        <RadioButton
                                            //value={label}
                                            //label={label}
                                            uncheckedColor={'#E6F0FD'}
                                            color={colors.blue.primary}
                                            status={supplierFilter.indexOf(supplier) !== -1 ? 'checked' : 'unchecked'}
                                            onPress={() => this.handleFilterUpdate(supplier)}
                                        />
                                        <View style={{ marginLeft: 7 }}>
                                            <Text style={commonStyles.text}>{supplier}</Text>
                                        </View>
                                    </View>
                                )
                            })
                            }
                        </View>
                        <AppButton text="APPLY" onPress={() => this.setState({ showFilterModal: false })} style={{ marginTop: 50 }} />
                    </View>
                </Modal>
                <View style={{ paddingBottom: 60 }}>
                    {openOrders.length > 0 ?
                        <View>
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={[commonStyles.lightHeading]}>Open Orders</Text>
                            </View>
                            { //!this.state.getOrdersLoading ? <ActivityIndicator size="small" color={colors.blue.primary} style={{ alignSelf: 'center', marginTop: 70 }} />:
                            }
                            <View style={[commonStyles.card, { marginBottom: 30 }]}>
                                {
                                    openOrders.map((order, i) => <OrderButton key={i} order={order} />)
                                }

                            </View>
                        </View>
                        : <ActivityIndicator size="small" color={colors.blue.primary} style={{ alignSelf: 'center', marginTop: 100 }} />

                    }
                    {deliveredOrders.length > 0 ?
                        <View>
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={[commonStyles.lightHeading]}>Delivered Orders</Text>
                            </View>
                            <View style={commonStyles.card}>
                                {
                                    deliveredOrders.map((order, i) => <OrderButton key={i} order={order} />)

                                }
                                {/* <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
                                    <Text style={commonStyles.lightText}>No Orders Delivered yet</Text>
                                </View> */}
                            </View>
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
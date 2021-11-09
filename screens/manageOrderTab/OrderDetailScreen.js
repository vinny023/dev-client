import React from 'react';
import { connect } from 'react-redux'
// import { Layout, Text } from '@ui-kitten/components';
import Banner from '../../components/Global/Banner'
import ProductList from '../../components/Global/ProductList'
import OrderTotal from '../../components/Global/OrderTotal'
import { StyleSheet, View, Text, Button, ScrollView, Image, ActivityIndicator, Linking } from 'react-native';
import { getOrders, setOrder } from '../../apis/apis'
import * as actions from '../../redux/actions'
import _ from 'lodash'
// import { ThemeService } from '@ui-kitten/components/theme/theme/theme.service';
import { colors, commonStyles, sizes } from '../../theme';
import StepIndicator from 'react-native-step-indicator';
import AppButton from '../../components/Global/AppButton';
import StatusComponent from '../../components/OrderDetailScreen/StatusComponent'

import TruckLogo from '../../assets/truck.png';
// var TruckLogo=require('../../assets/truck.png')
const Status = (props) => {
  //// console.log('STATUS')
  //// console.log("STATUS", props)
  switch (props.status) {
    case 'Queued':
      return (
        <StatusComponent status="Placed" placeDate="4/14" confirmDate="4/14" deliverDate="est 5/14" />
      )
    case 'Unqueued':
      return (
        <StatusComponent status="Placed" placeDate="4/14" confirmDate="4/14" deliverDate="est 5/14" />
      )
    case 'Placed':
      return (
        <StatusComponent status="Placed" placeDate="4/14" confirmDate="4/14" deliverDate="est 5/14" />
      )
    case 'Confirmed':
      return (
        <StatusComponent status="Confirmed" placeDate="4/14" confirmDate="4/14" deliverDate="est 5/14" />
      )
    case 'Delivered':
      return (
        <StatusComponent status="Delivered" placeDate="4/14" confirmDate="4/14" deliverDate="5/14" />

      )
  }
}

export class OrderDetailScreen extends React.Component {

  constructor(props) {
    super(props)

    //pull orderID from route params

    // // console.log('ROUTE PARAMS')
    // // console.log(props.route.params)
    const { navigation } = this.props
    // const orderId = navigation.getParams('orderId'),
    // const orderId = 'arvindsdeli-sysco-2021.3.17.20.33-[["sysco-61208",3],["sysco-741520",2]]'
    let order = {}
    let orderId = props.route.params.orderId
    if (props.route.params.order) {
      order = props.route.params.order
      orderId = props.route.params.order.id
    }

    this.state = {
      orderId: orderId,
      banner: { show: false, type: '', message: '' },
      order: order,
      getOrderLoading: false,
      getOrderError: false,
      setOrderLoading: false,
      setOrderError: false,
    }

  }
  setOrderDetail = async (update) => {
    try {
      this.setState({ setOrderLoading: true })
      const response = await setOrder({ update: update, id: this.state.orderId })
      // // console.log(response)
      const newOrder = { ...this.state.order, ...update }
      this.setState({
        setOrderLoading: false,
        order: newOrder,
        banner: { show: true, type: 'success', message: 'Order ' + Object.keys(update)[0] + ' updated!' }
      })

    }
    catch (error) {
      // // console.log(error)
      this.setState({
        banner: { show: true, type: 'error', message: 'Issue updating order. Please reach out to support if error persists.' },
        setOrderLoading: false,
        setOrderError: true
      })
    }
  }

  getOrder = async () => {

    try {
      this.setState({ getOrderLoading: true })
      const orders = await getOrders({ query: { id: this.state.orderId } })
      // // console.log(orders)
      this.setState({
        order: orders[0],
        getOrderLoading: false,
      })
    }
    catch (error) {
      // // console.log(error)
      this.setState({
        getOrderLoading: false,
        getOrderError: true
      })
    }
  }

  addItemQty = (payload, quantity) => {

  }

  reorderAllItems = () => {
    // // console.log('running reorder all items')
    let i = 0;
    try {
      this.state.order.cart.forEach((item) => {
        this.props.addItem({ item: { ...item }, amount: item.quantity })
        i++
      })
      this.setState({
        banner: { show: true, type: 'success', message: 'All ' + i + ' item(s) added to cart!' }
      })
    } catch (err) {
      // // console.log(err)
      this.setState({
        banner: { show: true, type: 'error', message: 'Error adding all items to cart. Only added ' + i + ' items to cart' }
      })
    }
  }

  reorderNotification = (item) => {
    this.setState({ banner: {  show: true, 
                              type: 'success', 
                              message: item.quantity + ' x  '+item.displayName + ' added to cart! Tap here to change quantity in cart' ,
                              action: 'navigateToCart',                              
                              actionParam: {} 
                  }})
  }

  bannerAction = (action, actionParam) => {
    // // console.log('BANNER ACTION RUNNING');
    switch (action) {
      case 'navigateToCart':
   
      // // console.log('NAVIGATE TO CART RUNNING');
        this.props.navigation.navigate('Tabs',{screen:'CartScreen'})
    }
    
  }
 
  hideBanner = () => {
    this.setState({ banner: { ...this.state.banner, show: false } })
  }

  async componentDidMount() {
    if (_.isEqual(this.state.order, {})) {
      await this.getOrder()
    }
  }

  render() {
    // console.log('rendering orderdertailscreen')
    // // console.log(this.state.order.cart)
    // // console.log(this.state.order)
    const { order } = this.state
    const {supplierDetail} = order
    // // console.log('ORDER');
    // // console.log(order);

    let total = 0;
    order.cart.forEach(item => item.price ? total = total + item.price*item.quantity : total = total)
    order.orderTotal = total+order.deliveryFee

    // let orderDay=await order.selectedDeliveryDate.date;
    // let orderDate=order.selectedDeliveryDate.date.slice(0,9)
    // let weekDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    //// console.log(order.selectedDeliveryDate,"date test")

   let orderNumber = order.createdDate.toString()
    orderNumber = orderNumber.slice(2, orderNumber.length-4)
    return (
      <>
      <View>
      </View>
        <ScrollView contentContainerStyle={[commonStyles.container, { paddingBottom: 80, }]}>
          <Banner banner={this.state.banner} hideBanner={this.hideBanner} bannerAction={this.bannerAction} />
          {_.isEqual(this.state.order, {}) ?
            <ActivityIndicator size="small" color={colors.blue.primary} style={{ alignSelf: 'center', marginTop: 70 }} />
            :
            <View>
              <View style={{ paddingHorizontal: 5 }}>
                <View style={[commonStyles.row, { justifyContent: 'space-between', paddingBottom: 0,paddingVertical:0 }]}>
                  <View style={{ width: '80%' }}>
      <Text style={{ fontFamily: 'bold', fontSize: sizes.s20, color: colors.text}}>{'Order #'+orderNumber}</Text>

                    <Text style={{ fontSize: sizes.s18, color: colors.blue.primary, fontFamily: 'regular'}}>{order.displayName}</Text>
                  </View>
                  <Image source={{ uri: order.logo }} resizeMode='contain' style={{ width: 60, height: 60 }} />
                </View>
                <View style={[commonStyles.row, {paddingBottom: 0,paddingVertical:0 }]}>
                  <Image source={TruckLogo} style={{ marginRight: 10,height: 20 }} />
                  {/* <Text style={{ fontSize: sizes.s19, fontFamily: 'medium', color: colors.text }}>{weekDays[orderDay-1]} - {orderDate}</Text> */}
                  <Text style={{ fontSize: sizes.s20, fontFamily: 'medium', color: colors.black.primary }}>{order.selectedDeliveryDate.day} - {order.selectedDeliveryDate.date}</Text>
                </View>
                <Text style={{ fontSize: sizes.s16, fontFamily: 'regular', color: colors.grey.primary }}>{order.selectedDeliveryTimeSlot}</Text>
              </View>
              <View style={[commonStyles.card, { paddingBottom: 5, marginTop: 20 }]}>
                <View >
                  <Text style={[commonStyles.lightHeading, { fontSize: sizes.s15 }]}>Order Status</Text>
                </View>
                <Status status={order.status} />
              </View>
              <View style={commonStyles.cartCard}>
                <ProductList
                  navigation={this.props.navigation}
                  productList={this.state.order.cart}
                  reorderNotification={this.reorderNotification}
                
                  reorderOnly={true}
                />
              </View>

                            {order.orderTotal > 0 ?
                              <View style={[commonStyles.card]} >
                              <View>
                                    <View style={[styles.row]}>
                                        <Text style={styles.heading}>Minimum </Text>
                                        <Text style={styles.boldText}>${order.orderMinimum.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.heading}>Subtotal</Text>
                                        <Text style={styles.boldText}>${(order.orderTotal - order.deliveryFee).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.heading}>Delivery fee</Text>
                                        <Text style={styles.boldText}>${order.deliveryFee.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.heading}>Total</Text>
                                        <Text style={styles.boldText}>${order.orderTotal.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                    </View>
                                </View>
                                </View>
                             : <></>
                      
                            }
                            







              
            </View>
          }
          {//this.state.order.cart.length >1 &&
            <AppButton text='Reorder all items'
              onPress={() => this.reorderAllItems()}
              style={{ marginTop: 5, backgroundColor: colors.blue.light, elevation: 0 }}
              textStyle={{ color: colors.blue.primary }} />
          }
          <AppButton
            text={'Contact '+order.displayName}
            onPress={() => Linking.openURL('mailto:'+this.props.account.supplierContact[order.supplierId].contact)}
            style={{ marginTop: 5, backgroundColor: colors.blue.light, elevation: 0 }}
            textStyle={{ color: colors.blue.primary }} />
        </ScrollView>
        <View style={{ position: 'absolute', bottom: 0, flex: 1, alignSelf: 'center', padingHorizontal: 10, backgroundColor: 'rgba(255,255,255,.3)', width: '100%' }}>
          {order.status === 'Delivered' ?
            <></>
            :
            <AppButton text='Confirm Delivery' onPress={() => this.setOrderDetail({ status: "Delivered" })} style={[commonStyles.shadow,{ marginHorizontal: 20 }]} />
          }
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
  return (
    {
      addItem: addItemProps => dispatch(actions.addItem(addItemProps)),
      subtractItem: subtractItemProps => dispatch(actions.subtractItem(subtractItemProps))
    }
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailScreen)


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
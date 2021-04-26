import React from 'react';
import { connect } from 'react-redux'
// import { Layout, Text } from '@ui-kitten/components';
import Banner from '../../components/Global/Banner'
import ProductList from '../../components/Global/ProductList'
import OrderTotal from '../../components/Global/OrderTotal'
import { View, Text, Button, ScrollView, Image, ActivityIndicator } from 'react-native';
import { getOrders, setOrder } from '../../apis/apis'
import * as actions from '../../redux/actions'
import _ from 'lodash'
import { ThemeService } from '@ui-kitten/components/theme/theme/theme.service';
import { colors, commonStyles, sizes } from '../../theme';
import StepIndicator from 'react-native-step-indicator';
import AppButton from '../../components/AppButton';
import StatusComponent from '../../components/StatusComponent';

const Status = (props) => {
  //console.log('STATUS')
  //console.log("STATUS", props)
  switch (props.status) {
    case 'Queued':
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

    console.log('ROUTE PARAMS')
    console.log(props.route.params)
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
      console.log(response)
      const newOrder = { ...this.state.order, ...update }
      this.setState({
        setOrderLoading: false,
        order: newOrder,
        banner: { show: true, type: 'success', message: 'Order ' + Object.keys(update)[0] + ' updated!' }
      })
    }
    catch (error) {
      console.log(error)
      this.setState({
        setOrderLoading: false,
        setOrderError: true
      })
    }
  }

  getOrder = async () => {

    try {
      this.setState({ getOrderLoading: true })
      const orders = await getOrders({ query: { id: this.state.orderId } })
      console.log(orders)
      this.setState({
        order: orders[0],
        getOrderLoading: false,
      })
    }
    catch (error) {
      console.log(error)
      this.setState({
        getOrderLoading: false,
        getOrderError: true
      })
    }
  }

  addItemQty = (payload, quantity) => {

  }

  reorderAllItems = () => {
    console.log('running reorder all items')
    let i = 0;
    try {
      this.state.order.cart.forEach((item) => {
        this.props.addItem({ item: { ...item }, amount: item.quantity })
        i++
      })
      this.setState({
        banner: { show: true, type: 'success', message: 'All ' + i + 'items added to cart!' }
      })
    } catch (err) {
      console.log(err)
      this.setState({
        banner: { show: true, type: 'error', message: 'Error adding all items to cart. Only added ' + i + ' items to cart' }
      })
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
    // console.log('rendering item')
    // console.log(this.state.order.cart)
    // console.log(this.state.order)
    const { order } = this.state
    const supplier = order.supplierDetail
    // let orderDay=await order.selectedDeliveryDate.date;
    // let orderDate=order.selectedDeliveryDate.date.slice(0,9)
    // let weekDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    console.log(order.selectedDeliveryDate,"date test")
    return (
      <>
        <ScrollView contentContainerStyle={[commonStyles.container]}>
          <Banner banner={this.state.banner} hideBanner={this.hideBanner} />
          {_.isEqual(this.state.order, {}) ?
            <ActivityIndicator size="small" color={colors.blue.primary} style={{ alignSelf: 'center', marginTop: 70 }} />
            :
            <View>
              <View style={{ paddingHorizontal: 15 }}>
                <View style={[commonStyles.row, { justifyContent: 'space-between', paddingBottom: 0 }]}>
                  <View>
                    <Text style={{ fontFamily: 'bold', fontSize: sizes.s25, color: colors.text }}>Order #425</Text>
                    <Text style={{ fontSize: sizes.s18, color: colors.blue.primary, fontFamily: 'regular' }}>{supplier.displayName}</Text>
                  </View>
                  <Image source={require('../../assets/woolco.png')} style={{ width: 60, height: 60 }} />
                </View>
                <View style={[commonStyles.row, { paddingBottom: 0 }]}>
                  <Image source={require('../../assets/truck.png')} style={{ marginRight: 10 }} />
                  {/* <Text style={{ fontSize: sizes.s19, fontFamily: 'medium', color: colors.text }}>{weekDays[orderDay-1]} - {orderDate}</Text> */}
                  <Text style={{ fontSize: sizes.s19, fontFamily: 'medium', color: colors.text }}>{order.selectedDeliveryDate.day} - {order.selectedDeliveryDate.date.slice(5,10)}</Text>
                </View>
                <Text style={{ fontSize: sizes.s18, fontFamily: 'regular', color: colors.text }}>{order.selectedDeliveryTimeSlot}</Text>
              </View>
              <View style={[commonStyles.card, { marginTop: 25 }]}>
                <Text style={commonStyles.lightHeading}>Order Status</Text>
                <View style={{ padding: 15 }}>
                  <Status status={order.status} />
                </View>
              </View>
              <View style={commonStyles.card}>
                <ProductList
                  navigation={this.props.navigation}
                  productList={this.state.order.cart}
                  listType="noFlatList"
                  reorderOnly={true}
                />
              </View>
              <OrderTotal order={order} />
            </View>
          }
          <AppButton text='Reorder all items' onPress={() => this.reorderAllItems()} style={{ backgroundColor: colors.black,elevation:0,marginTop:30 }} />
          <AppButton text='Contact Woolco' style={{marginTop:5,backgroundColor:colors.black,elevation:0}} />        
          <AppButton text='Confirm Delivery' onPress={() => this.setOrderDetail({ status: "Delivered" })} style={{marginTop:5,marginBottom:0}} />
        </ScrollView>
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
const customStyles = {
  stepIndicatorSize: 3,
  currentStepIndicatorSize: 0,
  separatorStrokeWidth: 4,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#ffffff',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#ffffff',
  stepStrokeUnFinishedColor: '#ffffff',
  separatorFinishedColor: colors.blue.primary,
  separatorUnFinishedColor: '#E5E5E5',
  stepIndicatorFinishedColor: '#ffffff',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: sizes.s16,
  currentStepIndicatorLabelFontSize: sizes.s16,
  stepIndicatorLabelCurrentColor: colors.grey.primary,
  stepIndicatorLabelFinishedColor: colors.grey.primary,
  stepIndicatorLabelUnFinishedColor: colors.grey.primary,
  //labelColor: colors.text,
  labelSize: sizes.s16,
  //currentStepLabelColor: colors.grey.primary,
  //  labelAlign:'right',
  labelFontFamily: 'medium'

}
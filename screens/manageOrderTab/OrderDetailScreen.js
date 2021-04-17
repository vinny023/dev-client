import React from 'react';
import {connect} from 'react-redux'
// import { Layout, Text } from '@ui-kitten/components';
import Banner from '../../components/Global/Banner'
import ProductList from '../../components/Global/ProductList'
import OrderTotal from '../../components/Global/OrderTotal'
import { View, Text, Button } from 'react-native';
import {getOrders, setOrder} from '../../apis/apis'
import * as actions from '../../redux/actions'
import _ from 'lodash' 
import { ThemeService } from '@ui-kitten/components/theme/theme/theme.service';

const Status = (props) => {
  console.log('STATUS')
  console.log(props)
  switch (props.status) {
    case 'Queued':
      return <Text>Order Status: Placed</Text> //REPLACE WITH IMAGES (SAME AS PLACED IMAGE)
    case 'Placed':
      return <Text>Order Status: Placed</Text> //REPLACE WITH IMAGES
    case 'Confirmed':
      return <Text>Order Status: Confirmed</Text> //REPLACE WITH IMAGES
    case 'Delivered':
      return <Text>Order Status: Delivered</Text> //REPLACE WITH IMAGES

  }
}

export class OrderDetailScreen extends React.Component {
    
    constructor(props) {
      super(props)

      //pull orderID from route params
      const {navigation} = this.props
      // const orderId = navigation.getParams('orderId'),
      const orderId = 'arvindsdeli-sysco-2021.3.17.20.33-[["sysco-61208",3],["sysco-741520",2]]'  
      let order = {}
      if (this.props.order) {
        order = this.props.order
      }   
      
      this.state = {     
        orderId: orderId,           
        banner: {show: false, type:'', message: ''},
        order: order,
        getOrderLoading: false,
        getOrderError: false,
        setOrderLoading: false,
        setOrderError: false,
      }

    } 

    setOrderDetail = async(update) => {
      try {  
        this.setState({ setOrderLoading: true })               
        const response = await setOrder({update: update, id: this.state.orderId })
        console.log(response)
        const newOrder = {...this.state.order, ...update}        
        this.setState({                 
            setOrderLoading: false, 
            order: newOrder,
            banner: {show: true, type:'success', message: 'Order ' +Object.keys(update)[0]+ ' updated!'}           
        })              
    }
    catch(error) {
        console.log(error)
        this.setState({
            setOrderLoading: false,
            setOrderError:true
        })
    }
    }    

    getOrder = async() => {

      try {      
        this.setState({ getOrderLoading: true })
        const orders = await getOrders({query: {id: this.state.orderId}})
        console.log(orders)
        this.setState({        
            order: orders[0],
            getOrderLoading: false,            
        })              
    }
    catch(error) {
        console.log(error)
        this.setState({
            getOrderLoading: false,
            getOrderError:true
        })
    }
    }

    addItemQty = (payload,quantity) => {
      
    }

    reorderAllItems = () => {
      console.log('running reorder all items')
      let i = 0;
      try {
      this.state.order.cart.forEach((item) => {
        this.props.addItem({item:{...item}, amount: item.quantity})
        i++
      })
      this.setState({
        banner: {show: true, type:'success', message: 'All '+i+'items added to cart!'}
      })
    } catch (err) {
      console.log(err)
      this.setState({
      banner: {show: true, type:'error', message: 'Error adding all items to cart. Only added '+i+' items to cart'}
    })
    }
    }

    hideBanner = () => {
      this.setState({banner: {...this.state.banner, show: false}})
    }

    async componentDidMount() { 
      if (_.isEqual(this.state.order,{})) {     
        await this.getOrder()           
      }
    } 

    render() {
      console.log('rendering item')
      console.log(this.state.order.cart)
      console.log(this.state.order)
      const {order} = this.state
      const supplier = order.supplierDetail

      return (
      <View>
      <Banner banner={this.state.banner} hideBanner={this.hideBanner}/>      
      <Button title = 'Confirm Delivery' onPress={() => this.setOrderDetail({status:"Delivered"})}/>     
     { _.isEqual(this.state.order,{}) ?
        <Text>Loading</Text>
         : 
        <View>
        <Text>Order From {supplier.displayName}</Text>
        <Text>Delivering On {order.selectedDeliveryDate.date} at {order.selectedDeliveryTimeSlot}</Text>
        <Status status={order.status} />
       <ProductList
        navigation={this.props.navigation}
        productList={this.state.order.cart}     
        listType="noFlatList"         
        reorderOnly={true}                
    /> 
    <OrderTotal order={order}/>    
    </View>
  }
      <Button title = 'Reorder all items' onPress={() => this.reorderAllItems()}/>      
      </View>

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
          addItem:addItemProps => dispatch(actions.addItem(addItemProps)),
          subtractItem:subtractItemProps => dispatch(actions.subtractItem(subtractItemProps))
      }
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailScreen)
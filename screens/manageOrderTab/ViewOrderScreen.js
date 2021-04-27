import React from 'react'
import { connect } from 'react-redux'
import ViewOrders from '../../components/ViewOrders'
import { Text, View, Image, Button, ScrollView, StyleSheet } from 'react-native'
import { getOrders, setOrder } from '../../apis/apis'
import Banner from '../../components/Global/Banner'
import * as Sentry from 'sentry-expo';
import { useNavigation } from '@react-navigation/native';

const OrderButton = ({order}) => {

    const navigation = useNavigation()
    return (
        <Button 
            title={order.supplierDetail.displayName}
            onPress = {() => navigation.navigate('OrderDetailScreen', {order: order})}
        />
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
            banner: { show: false, type: '', message: '', buttonAction: {}},
            showFilterModal: false
        }
    }

    getOrders = async () =>  {
        for (let i = 0; i < 3; i++) {
        try {
            console.log(i +' ATTEMPT')
            this.setState({ getOrdersLoading: true })
            const orders = await getOrders({ query: { accountId: this.props.account.accountId }, sort: {createdDate: -1}})
            console.log(orders)
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
              banner: {show: true, type:'error', message: 'Issue loading orders - trying again.'}
            })          
            } else {                
                //show errors if item is not loading, & try again
                this.setState({
                    banner: {show: true, 
                             type:'error', 
                             message: 'Could not load orders. Please refresh. If error persists - please contact support.',
                             buttonAction: {'title': 'Refresh', 'params':''}
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
            this.setState ( {
                supplierFilter: [...this.state.supplierFilter, newSupplier]
            })
        } else {
            let newSupplierFilter = [...this.state.supplierFilter]
            newSupplierFilter.splice(index,1)
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

        const {supplierFilter, orderList, showFilterModal} = this.state        
        
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
            }
        })

        console.log('OPEN ORDERS')
        console.log(openOrders)

        console.log('DELIVERED ORDERS')
        console.log(deliveredOrders)

        return (

        //show loading until orders has been pulled

        <View>
            <Banner banner={this.state.banner} hideBanner={this.hideBanner}/>    
            {
                this.props.account.activeSuppliers.map(supplier => {
                    console.log(supplier)
                    //CHECK IF SELECTED
                    let selected = false;
                    if (supplierFilter.indexOf(supplier) !== -1) {
                        selected = true;
                    }
                    return (            
                    <Button 
                        title = {supplier }
                        onPress={() => this.handleFilterUpdate(supplier)} 
                    />
                    )
                })            
            }      
            
            <Text>Open Orders</Text>
            {openOrders.map((order, i) => <OrderButton key={i} order={order} />)}           
            <Text>Delivered Orders</Text>   
            {deliveredOrders.map((order, i) => <OrderButton key={i} order={order} />)}           
        </View>
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




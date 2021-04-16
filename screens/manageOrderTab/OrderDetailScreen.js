import React from 'react';
import {connect} from 'react-redux'
// import { Layout, Text } from '@ui-kitten/components';
import { View, Text } from 'react-native';


export default class OrderDetailScreen extends React.Component {
    
    constructor(props) {
      super(props)

      //pull orderID from route params
      const {navigation} = this.props
      // const orderId = navigation.getParams('orderId'),
      const orderId
      
      this.setState({
        orderId: orderId,
        statusChanging: false  ,
        banner: {show: false, type:'', message: ''},
      })
    }

    async componentDidMount() {
      
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

export default connect(mapStateToProps)(CartScreen)
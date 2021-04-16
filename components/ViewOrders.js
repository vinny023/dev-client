import React from 'react'
import {View} from 'react-native'
import { connect } from "react-redux";
import SelectorList from './SelectorList'

export function ViewOrders({ orders }) {

    //any grouping or filtering action
    //title, search ,etc. 

    return(
        <View>
            <SelectorList screen={"OrderDetailScreen"} list={orders}/>
        </View>
    )
}

const mapStateToProps = state => {
    return (
        {
            orders: state.orderState.orders
        }
    )
}

export default connect(mapStateToProps,null)(ViewOrders)

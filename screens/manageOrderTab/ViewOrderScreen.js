import React from 'react'
import ViewOrders from '../../components/ViewOrders'

export default class ViewOrderScreen extends React.Component {

    constructor(props) {
        super(props) 
        
        this.setState({
            orderList: []
        })
    }

    //pull list of orders sorted by date

    //group orders between open & completed, which sits on top of sorting    

    //sort & filter? => filter can be done locally with filter modal - lets jsut do it using api

    //filters - status, supplier

    //sort - date, order total

    //show errors if item is not loading, or try again?
    
    async componentDidMount() {        

    }
    
    
    render() {

        //show loading until orders has been pulled

        //list of orders with button on press navigat to order with params
    }
        
    

}




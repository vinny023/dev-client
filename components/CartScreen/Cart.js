import React from 'react'
import {connect} from 'react-redux'
import {Text, View, Image} from 'react-native'
import SupplierCart from './SupplierCart'
import {getSuppliers} from '../../apis/apis'

export class Cart extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            supplierLoading: true,
            supplierDetail: [],
            isError: false
        }
    }    

    async componentDidMount() {

        console.log(this.props.masterCart)

        //query supplier database
        const suppliers = this.props.masterCart.map(supplierCart => {
            return supplierCart.supplierId
        })

        console.log('SUPPLIER QUERY PARAMS')
        console.log(suppliers)

        try {
            this.setState({
                supplierDetail: await getSuppliers(suppliers),
                supplierLoading: false
            })                 
        }
        catch(error) {
            console.log(error)
            this.setState({
                supplierLoading: false,
                isError:true
            })
        }
    }

    render() {

    const {masterCart, navigation} = this.props

    // CHECK IF NUMBER OF SUPPLIERS HAS CHANGED AND AJDUST ARRAY OF SUPPLIER DETAIL ACCORDINGLY       
    if (!this.state.supplierLoading) {
        if (this.state.supplierDetail.length > masterCart.length) {
            let removeIndex = -1
            const activeSuppliers = masterCart.map(supplierCart => supplierCart.supplier.supplierId)
            this.state.supplierDetail.forEach((supplier, index) => {
                if (activeSuppliers.indexOf() === -1) {
                    removeIndex = -1
                }
            })
            //DON'T RERENDER - JUST CHANGE SUPPLIER DETAIL ARRAY
            this.state.supplierDetail =  this.state.supplierDetail.splice(removeIndex,1)            
        } 
    }
        
    
    console.log(this.state)

     return (
        <View> {
          masterCart.map((supplierCart, index) => {
                return (
                    <View key={index} style={{flex: 1, flexDirection: 'column', backgroundColor: 'red', marginBottom:10, justifyContent: "flex-start"}}>
                    <SupplierCart 
                            navigation={navigation} 
                            supplierCart={supplierCart} 
                            supplierLoading={this.state.supplierLoading} 
                            supplierDetail={this.state.supplierDetail[index]} />
                    </View>
                )
           })}
          
         </View>           
        )
    }        
}

const mapStateToProps = state => {
    return (
        {
            masterCart: state.cartState.masterCart
        }
    )
}

export default connect(mapStateToProps,null)(Cart)
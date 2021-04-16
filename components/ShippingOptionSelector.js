import React from 'react'
import {Text, View, Image} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import * as actions from '../redux/actions'
import {connect} from 'react-redux'

export class ShippingOptionSelector extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: 0
        }
    }

    render() {

        //check selected value from cart
        let selectedIndex = 0
        this.props.masterCart.forEach(supplierCart => {
            if (supplierCart.supplier.supplierId === this.props.supplierId) {
                if (supplierCart.shippingOption) {
                    this.props.options.forEach((shippingOption, index) => {
                        if (shippingOption.title === supplierCart.shippingOption.title) {
                            selectedIndex = index;
                        }
                    })
                }
            } 
        })

        console.log(this.props.options)

        return (
            <View>
                <Text>Shipping Options</Text>
                <Picker        
                selectedValue={selectedIndex}        
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue, itemIndex) => this.props.setShippingOption({supplierId: this.props.supplierId, option: this.props.options[itemIndex]})}
                >
                    {this.props.options.map((option, index) => {
                        return <Picker.Item  key={index} label={option.title} value={index} />
                    })                               
                }
                </Picker>
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

const mapDispatchToProps = dispatch => {
    return (
        {
            setShippingOption: params => dispatch(actions.setShippingOption(params))            
        }
    )
}


export default connect(mapStateToProps, mapDispatchToProps)(ShippingOptionSelector)
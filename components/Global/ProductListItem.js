import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import * as actions from '../../redux/actions'
import {connect} from 'react-redux'
import _ from 'lodash';

// export class ProductListItem extends React.Component {

//     constructor(props) {
//         super(props)
//    }

const updateQuantity = (masterCart, product) => {
    for (const supplierCart of masterCart) {
        for (const cartItem of supplierCart.cart) {
                if (cartItem.sku === product.sku) {
                   return cartItem.quantity
                }           
        }
    }
    return 0
}

class ProductListItem extends React.PureComponent  {
    
    constructor(props) {
        super(props)
        this.state = {quantity: 0}

        // this.addItem = this.addItem.bind(this)
        // this.subtractItem = this.subtractItem.bind(this)
    }

    componentDidMount() {  

        this.setState({
            quantity: updateQuantity(this.props.masterCart, this.props.item)
        })
    } 
    
    componentDidUpdate(prevProps, prevState) {

        if (!_.isEqual(prevProps.masterCart , this.props.masterCart)) {
            this.setState({
                quantity: updateQuantity(this.props.masterCart, this.props.item)
            })   
        }
    }

    addItem = (payload) => {
        this.props.addItem({item:{...this.props.item}, amount: 1})
    }
    
    subtractItem = (payload) => {
        this.props.subtractItem({item:{...this.props.item}, amount: 1})
    }

    removeItem = () => {
        this.props.subtractItem({item:{...this.props.item}, amount: this.state.quantity})
    }

    render() {  
        
        const {item} = this.props

        //  console.log('PRODUCT LIST ITEM RENDERING')
        // console.log(item)
        // console.log(item.displayName)

    
        return (   
            <View>{
                (!this.props.hideZero || this.state.quantity !== 0) &&
            <View style={{flex: 1, flexDirection: 'row', alignItems:'center', justifyContent:'space-evenly'}}
            key={item.sku}
            >
            <Text>{item.displayName}</Text>
            <Text>{item.price}</Text>
            {
                (item.quantity >= 1) && (<Button 
                    title="Remove"
                    onPress={this.removeItem}
                />)
            }            
            <Button 
                title="-" //MINUS BUTTON 
                onPress = {this.subtractItem}
            />
            <Text>{this.state.quantity}</Text>
            <Button 
                title=" + " //ADD BUTTON
                onPress = {this.addItem}
                />
            </View>
        }
            </View>         
         
            )

        }
    
}


const mapDispatchToProps = dispatch => {
    return (
        {
            addItem:addItemProps => dispatch(actions.addItem(addItemProps)),
            subtractItem:subtractItemProps => dispatch(actions.subtractItem(subtractItemProps))
        }
    )
}

const mapStateToProps = state => {
    return (
        {
            masterCart: state.cartState.masterCart
        }
    )
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductListItem)


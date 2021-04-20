import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, TextInput } from 'react-native';
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'
import _ from 'lodash';
import { colors, sizes } from '../../theme';
import AppButton from '../../components/AppButton'
// export class ProductListItem extends React.Component {

//     constructor(props) {
//         super(props)
//    }

const updateQuantity = (masterCart, product, reorderOnly) => {
    console.log(reorderOnly)
    if (reorderOnly) {
        return product.quantity
    }
    for (const supplierCart of masterCart) {
        for (const cartItem of supplierCart.cart) {
            if (cartItem.sku === product.sku) {
                return cartItem.quantity
            }
        }
    }
    return 0
}

class ProductListItem extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = { quantity: 0 }

        // this.addItem = this.addItem.bind(this)
        // this.subtractItem = this.subtractItem.bind(this)
    }

    componentDidMount() {

        this.setState({
            quantity: updateQuantity(this.props.masterCart, this.props.item, this.props.reorderOnly)
        })
    }

    componentDidUpdate(prevProps, prevState) {

        if (!_.isEqual(prevProps.masterCart, this.props.masterCart)) {
            this.setState({
                quantity: updateQuantity(this.props.masterCart, this.props.item, this.props.reorderOnly)
            })
        }
    }

    addItem = (payload) => {
        this.props.addItem({ item: { ...this.props.item }, amount: 1 })
    }

    addItemQty = (payload) => {
        this.props.addItem({ item: { ...this.props.item }, amount: this.state.quantity })
    }

    setItemQty = (payload, quantity) => {
        if (quantity < this.state.quantity) {
            this.props.subtractItem({ item: { ...this.props.item }, amount: this.state.quantity - quantity })
        } else {
            this.props.addItem({ item: { ...this.props.item }, amount: quantity - this.state.quantity })
        }
    }

    subtractItem = (payload) => {
        this.props.subtractItem({ item: { ...this.props.item }, amount: 1 })
    }

    removeItem = () => {
        this.props.subtractItem({ item: { ...this.props.item }, amount: this.state.quantity })
    }

    render() {

        const { item } = this.props

        //  console.log('PRODUCT LIST ITEM RENDERING')
        // console.log(item)
        // console.log(item.displayName)

        // <TextInput value={this.state.quantity} onSubmitEditing={this.setItemQty(text => parseInt(text,10))}></TextInput>

        return (
            <View style={styles.productItem}>{
                (!this.props.hideZero || this.state.quantity !== 0) &&
                <View key={item.sku}>
                    <View style={styles.row}>
                        <AppButton
                            text={item.supplierDisplayName}
                            style={{ height: 30, paddingHorizontal: 10 }}
                            textStyle={{ fontSize: sizes.s14 }}
                        />
                        <Text style={styles.text}>{item.price}</Text>
                    </View>

                    <View style={styles.row}>
                        <View style={{flex:1}}>
                            <Text style={styles.text}>{item.displayName}</Text>
                        </View>
                        {!this.props.reorderOnly &&
                            <View>
                                {/* {
                                    (item.quantity >= 1) && (<Button
                                        title="Remove"
                                        onPress={this.removeItem}
                                    />)
                                } */}
                                <View style={styles.counterContainer}>

                                    {/* MINUS BUTTON */}
                                    <TouchableOpacity style={styles.signContainer} onPress={this.subtractItem}>
                                        <Text style={styles.boldText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.boldText}>{this.state.quantity}</Text>
                                    {/* ADD BUTTON */}
                                    <TouchableOpacity style={styles.signContainer} onPress={this.addItem}>
                                        <Text style={styles.boldText}>+</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        }
                    </View>
                    {this.props.reorderOnly &&
                        <Button
                            title="Reorder"
                            onPress={this.addItemQty}
                        />

                    }
                </View>
            }
            </View>

        )

    }

}


const mapDispatchToProps = dispatch => {
    return (
        {
            addItem: addItemProps => dispatch(actions.addItem(addItemProps)),
            subtractItem: subtractItemProps => dispatch(actions.subtractItem(subtractItemProps))
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductListItem)
const styles = StyleSheet.create({
    productItem: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingBottom:15,
       
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
    ,
    text: {
        fontSize: sizes.s16,
       // fontFamily: 'medium',
        color: colors.text,


    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: colors.blue.light,
        borderRadius: 10
    },
    signContainer: {
        paddingHorizontal: 15
    },
    boldText:{
        fontSize:sizes.s20,
       // fontFamily:'bold',
        color:colors.blue.primary
    }

})

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'
//import _ from 'lodash';
import _, { floor, round } from 'lodash';

import { colors, commonStyles, sizes } from '../../theme';
import AppButton from './AppButton'
// export class ProductListItem extends React.Component {
//     constructor(props) {
//         super(props)
//    }

const updateQuantity = (masterCart, product, reorderOnly) => {
    // console.log(reorderOnly)
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

class ProductListItem extends React.Component {

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

        // if (!_.isEqual(prevProps.masterCart, this.props.masterCart)) {
        if (!_.isEqual(prevProps, this.props)) {
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

        let priceString = 'Pricing unavailable'
        if (item.price) {
            priceString = '$' + item.price + ' ($' + item.unitCost + ' / ' + item.units + ')'
        }

        //  console.log('PRODUCT LIST ITEM RENDERING')

        // <TextInput value={this.state.quantity} onSubmitEditing={this.setItemQty(text => parseInt(text,10))}></TextInput>
        return (
            <View style={styles.productItem}>{
                (!this.props.hideZero || this.state.quantity !== 0) &&
                <View key={item.sku}>
                    <View style={styles.row}>
                        <View style={{flex:0.9,alignSelf:'flex-start',paddingRight:3}}>
                            {!this.props.reorderOnly &&
                              
                                //--------- Tags------------
                                <View style={[styles.row, { justifyContent:'flex-start' }]}>
                                    <View style={styles.tagContainer}>
                                        <Text style={[commonStyles.btnText, { fontSize: sizes.s13, fontFamily: 'medium' }]}>{item.supplierDisplayName}</Text>
                                    </View>
                                    {item.brand ?
                                        <View style={[styles.tagContainer, { marginLeft: 4 }]}>
                                            <Text style={[commonStyles.btnText, { fontSize: sizes.s13, fontFamily: 'medium' }]}>{item.brand}</Text>
                                        </View>
                                        : <></>
                                    }
                                </View>
                            }
                             {/* -------Item name Price and Units------- */}
                            <View >
                                <Text style={styles.text}>{item.displayName}</Text>
                                {this.props.reorderOnly ?
                                    <View style={[styles.row, { marginTop: 5, justifyContent: 'flex-start' }]}>
                                        <View style={[styles.addContainer, { borderRadius: 10, marginRight: 5 }]}>
                                            <Text style={{ fontSize: sizes.s16, fontFamily: 'regular', color: colors.blue.primary }}>{this.state.quantity}</Text>
                                        </View>
                                        <View>
                                            <Text style={[commonStyles.lightText,]}>{item.qtyString}</Text>
                                            <Text style={[styles.text, { fontSize: sizes.s13, fontFamily: 'regular', }]}>{priceString}</Text>
                                        </View>
                                    </View>
                                    :
                                    <View>
                                        <Text style={[commonStyles.lightText,{paddingTop:2}]}>{item.qtyString}</Text>
                                        <Text style={[styles.text, { fontSize: sizes.s13, fontFamily: 'regular' }]}>{priceString}</Text>
                                    </View>
                                }
                            </View>
                        </View>
                        <View>
                        {this.state.quantity >= 1 &&
                            <View style={{ marginTop: 0, flex: 1 }} >
                                {item.price &&
                                    <View >
                                        <Text style={styles.text, { textAlign: "right", fontFamily: "medium" }}>${round(item.price * this.state.quantity, 2)}</Text>
                                    </View>
                                }
                                <Text style={styles.text, { textAlign: "right", color: colors.grey.primary, fontFamily: 'regular' }}>{item.size * item.qtyPerItem * this.state.quantity}{item.units}</Text>
                            </View>
                        }
                            {!this.props.reorderOnly &&
                                <View style={{ paddingTop: 5 }}>
                                    {this.state.quantity == 0 ?
                                        <TouchableOpacity onPress={this.addItem} style={styles.addContainer}>
                                            <Text style={[styles.boldText]}>+</Text>
                                        </TouchableOpacity>
                                        :
                                        <>
                                            <View style={styles.counterContainer}>
                                                {/* MINUS BUTTON */}
                                                <TouchableOpacity style={styles.signContainer} onPress={this.subtractItem}>
                                                    <Text style={styles.boldText}>-</Text>
                                                </TouchableOpacity>
                                                <View style={styles.signContainer}>
                                                    <Text style={styles.boldText}>{this.state.quantity}</Text>
                                                </View>
                                                {/* ADD BUTTON */}
                                                <TouchableOpacity style={styles.signContainer} onPress={this.addItem}>
                                                    <Text style={styles.boldText}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity onPress={this.removeItem} style={{ paddingTop: 5 }}>
                                                <Text style={[commonStyles.lightText, { color: colors.pink, textAlign: 'right' }]}>Remove Item</Text>
                                            </TouchableOpacity>
                                        </>
                                    }
                                   
                                </View>
                            }
                            {this.props.reorderOnly &&
                                <AppButton
                                    text="Reorder"
                                    style={{ paddingHorizontal: 24, height: 42,marginVertical:0,marginTop:5,elevation:0 }}
                                    textStyle={{ fontSize: sizes.s15, fontFamily: 'medium' }}
                                    onPress={this.addItemQty}
                                />
                                // <TouchableOpacity style={[styles.counterContainer, { paddingHorizontal: 20, marginTop: 15 }]}>
                                //     <Text style={[styles.boldText, { fontSize: sizes.s15, fontFamily: 'medium' }]}>Reorder</Text>
                                // </TouchableOpacity>

                            }
                        </View>
                    </View>
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
        paddingHorizontal: 8,
        paddingBottom: 15,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        // fontSize: sizes.s16,
        fontSize: sizes.s15,
        fontFamily: 'medium',
        color: colors.text,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: colors.blue.light,
        borderRadius: 10,
        width: 100
    },
    signContainer: {
        paddingHorizontal: 10,
        // alignItems:'center',
        //backgroundColor:'red'
    },
    boldText: {
        fontSize: sizes.s20,
        fontFamily: 'bold',
        color: colors.blue.primary,
        textAlign: 'center'
    },
    addContainer: {
        backgroundColor: colors.blue.light,
        height: 40,
        borderRadius: 40,
        width: 40,
        alignItems: 'center', justifyContent: 'center'
    },
    tagContainer: { 
        backgroundColor: colors.blue.primary,
         paddingVertical: 4,
          paddingHorizontal: 11, borderRadius: 10, 
          marginBottom: 5 
        }

})

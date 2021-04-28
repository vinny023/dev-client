import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'
import _ from 'lodash';
import { colors, commonStyles, sizes } from '../../theme';
import AppButton from '../../components/AppButton'
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

        //  console.log('PRODUCT LIST ITEM RENDERING')
        console.log(item)
        // console.log(item.displayName)
        // <TextInput value={this.state.quantity} onSubmitEditing={this.setItemQty(text => parseInt(text,10))}></TextInput>
        return (
            <View style={styles.productItem}>{
                (!this.props.hideZero || this.state.quantity !== 0) &&
                <View key={item.sku}>
                    <View style={styles.row}>
                        <AppButton
                            text={item.supplierDisplayName}
                            style={{ height: 30, paddingHorizontal: 10, marginVertical: 5 }}
                            textStyle={{ fontSize: sizes.s14,fontFamily:'medium' }}
                        />
                        <View >
                            <Text style={styles.text, { textAlign: "right", fontWeight: "bold" }}>${item.price}</Text>
                            <Text style={commonStyles.lightText, { textAlign: "right" }}>40 Lbs</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.text}>{item.displayName}</Text>
                            <Text style={[commonStyles.lightText,]}>5 x 2000 count</Text>
                            <Text style={[styles.text, { fontSize: sizes.s14, fontFamily: 'regular' }]}>$2.80 ($0.01 / count) </Text>
                        </View>
                        {!this.props.reorderOnly &&
                            <View style={{ paddingTop: 10 }}>
                                {/* {
                                    (item.quantity >= 1) && (<Button
                                        title="Remove"
                                        onPress={this.removeItem}
                                    />)
                                } */}
                                {this.state.quantity == 0 ?
                                    <TouchableOpacity onPress={this.addItem} style={styles.addContainer}>
                                        <Text style={[styles.boldText, { fontSize: sizes.s30, fontFamily: 'bold' }]}>+</Text>
                                    </TouchableOpacity>
                                    :
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
                                }
                            </View>
                        }
                        {this.props.reorderOnly &&
                            // <AppButton
                            //     text="Reorder"
                            //     style={{ backgroundColor: colors.blue.light, }}
                            //     textStyle={{ color: colors.blue.primary }}
                            //     onPress={this.addItemQty}
                            // />
                            <TouchableOpacity style={[styles.counterContainer,{paddingHorizontal:20,marginTop:15}]}>
                                <Text style={[styles.boldText,{fontSize:sizes.s15,fontFamily:'medium'}]}>Reorder</Text>
                            </TouchableOpacity>

                        }
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
        borderRadius: 10
    },
    signContainer: {
        paddingHorizontal: 15
    },
    boldText: {
        fontSize: sizes.s20,
        fontFamily: 'bold',
        color: colors.blue.primary
    },
    addContainer: {
        backgroundColor: colors.blue.light,
        height: 40,
        borderRadius: 40,
        width: 40,
        alignItems: 'center', justifyContent: 'center'
    }

})

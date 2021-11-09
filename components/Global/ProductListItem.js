import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'
//import _ from 'lodash';
import _, { floor, round } from 'lodash';
import {store, getLastAction} from '../../redux/store'

import { colors, commonStyles, sizes } from '../../theme';
import AppButton from './AppButton'

// export class ProductListItem extends React.Component {
//     constructor(props) {
//         super(props)
//    }

// let justUpdated = false;

const updateQuantity = (masterCart, product, reorderOnly) => {

    // // console.log('RUNNING UPDATE QUANTITY');
    // // console.log(product.sku);
    // // console.log(masterCart);
    // // console.log(reorderOnly)
    if (reorderOnly) {
        return product.quantity
    }
    for (const supplierCart of masterCart) {
        for (const cartItem of supplierCart.cart) {
            if (cartItem.sku === product.sku) {
                // // console.log(cartItem.quantity);
                return cartItem.quantity
            }
        }
    }
   
    return 0
}

class ProductListItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = { quantity: 0, localEdit: false }

        // this.addItem = this.addItem.bind(this)
        // this.subtractItem = this.subtractItem.bind(this)
    }

    componentDidMount() {

        this.setState({
            quantity: updateQuantity(this.props.masterCart, this.props.item, this.props.reorderOnly)
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        // // console.log('SHOULD COMPONENT UPDATE');
        // // console.log(this.props.item.sku);
        // // console.log(this.state.quantity);
        // // console.log(prevState.quantity);

        if (this.props.reorderOnly) {
            return false
        }

        if (this.props.masterCart.length === 0) {
            return true
        }

        // if (this.state.quantity === '') {
        //     return false
        // }
        //if size of cart changed, don't update

        //if quantity of item has changed, 
        // // console.log('SHOULD COMPONENT UPDATE');
        // // console.log(getLastAction());

        let lastAction = getLastAction()
        // // console.log(lastAction);
        // // console.log(this.state.quantity !== nextState.quantity);
        // // console.log((lastAction.payload.item && lastAction.payload.item.sku === this.props.item.sku));
        // // console.log((lastAction.type === "REMOVE_ORDERED_CART" || lastAction.type === "SYNC_CART"));

        // if (this.state.quantity !== nextState.quantity) {
        //     justUpdated = true
        // }

        return (this.state.quantity !== nextState.quantity || (lastAction.payload.item && lastAction.payload.item.sku === this.props.item.sku) || lastAction.type === "REMOVE_ORDERED_CART" || lastAction.type === "SYNC_CART")
    }

    componentDidUpdate(prevProps, prevState) {

        // // console.log('RUNNING COMPONENT DID UPDATE');
        //ONLY DO THIS IF THE CHANGE DOESNT COME FROM THIS COMPONENT

        // // console.log('RUNNING ITEM COMP UPDATE');
        // // console.log(prevProps.item);
        // // console.log(this.props.item);

        // if (!_.isEqual(prevProps.item, this.props.item)) {
        //     // console.log('SENSED ITEM CHANGE');    
        //     this.setState({
        //         quantity: updateQuantity(this.props.masterCart, this.props.item, this.props.reorderOnly)
        //     })
        // }
        if (!_.isEqual(prevProps.masterCart, this.props.masterCart)) {
            // // console.log('executing first cart change');

            if (this.state.quantity !== '') {
            this.setState({
                quantity: updateQuantity(this.props.masterCart, this.props.item, this.props.reorderOnly)
            })
            }
        }
    
}

    addItem = (payload) => {
        this.setState({
            quantity:this.state.quantity+1 //fires rerender 1
        })

        setTimeout(() => {
            this.props.addItem({ item: { ...this.props.item }, amount: 1 })
       },1)
        
    }

    addItemQty = (payload) => { 
        // // console.log('FINRING ADD ITEM QTY ON REORDER');
        // // console.log(this.props.item);
        // // console.log(this.state.quantity)       
        this.props.addItem({ item: { ...this.props.item }, amount: this.state.quantity })
    }

    setItemQty = (payload, quantity) => {
        this.setState({
            quantity:quantity
        })
        setTimeout(() => {
        if (quantity < this.state.quantity) {
                this.props.subtractItem({ item: { ...this.props.item }, amount: this.state.quantity - quantity })
            } else {
                this.props.addItem({ item: { ...this.props.item }, amount: quantity - this.state.quantity })
            }
                
           },1)   
   
    }

    subtractItem = (payload) => {
        this.setState({
            quantity:this.state.quantity-1
        })
        setTimeout(() => {
             this.props.subtractItem({ item: { ...this.props.item }, amount: 1 })
        },1)
        // this.props.subtractItem({ item: { ...this.props.item }, amount: 1 })

    }

    removeItem = () => {

        const oldQuantity = this.state.quantity
        this.setState({
            quantity:0
        })

        setTimeout(() => {
            this.props.subtractItem({ item: { ...this.props.item }, amount: oldQuantity })
        },1)
        
    }

    setCounterValue = (val) => {

        // console.log('FIRING ON TEXT CHANGE')
        // console.log(val);


        //IF BLANK WAS ENTERED
        if (val === '') {

            const oldQuantity = this.state.quantity
            this.setState({quantity: ''})
            setTimeout(() => {
                    this.props.subtractItem({ item: { ...this.props.item }, amount: oldQuantity, dontRemove: true  })

                    setTimeout(() => {
                    if (this.state.quantity === '') {
                        this.setState({quantity: 0})
                    }

                    this.props.subtractItem({ item: { ...this.props.item }, amount: 0 })
                }, 10000)
               
            }, 1)   
       
        
        } else if (!isNaN(val)) {
            val = parseFloat(val)   
            
        //CASE IF EXISTING TEXT INPUT WAS BLANK
        if (this.state.quantity === '') {   
                   
        this.setState({ quantity:val})
        setTimeout(() => {

            this.props.addItem({ item: { ...this.props.item }, amount: val})
        },1)
    
        } else {


        //IF ENTERED VALUE IS LESS THAN ORIGINAL QUANTITY
            if (val < this.state.quantity) {

                const oldQuantity = this.state.quantity
                this.setState({
                    quantity:val
                })
                setTimeout(() => {

                    this.props.subtractItem({ item: { ...this.props.item }, amount: oldQuantity - val })
                },1)

                
            } else {  //IF ENTERED VALUE IS GREATER THAN ORIGINAL QUANTITY
                
                // ADD ITEM
                const oldQuantity = this.state.quantity
                this.setState({
                    quantity:val
                })
                setTimeout(() => {

                    this.props.addItem({ item: { ...this.props.item }, amount: val - oldQuantity})
                },1)
                
                // else {
                //     this.setState({
                //         quantity:this.state.quantity - 1
                //     })
                //     setTimeout(() => {
    
                //         this.props.addItem({ item: { ...this.props.item }, amount: val - this.state.quantity })
                //     },1)
                       
                    
                // }
            }

        }
        } 
        // else {
        //     this.removeItem();
        // }
    }

    onTextSubmit = (val) => {
        // console.log('FIRING ON TEXTS BUMIT')
        // // console.log('VAL');
        // if (val === '') {
        //     // // console.log('FOUND EMTPY TEXT INPUT')
        //     this.props.subtractItem({ item: { ...this.props.item }, amount: this.props.item.quantity})
        // }
    }

    render() {

        // // console.log('PROD LIST ITEM RENDERING');
        // // console.log(this.props.item.sku);

        const { item } = this.props
        const today = new Date()

        //check if recently orderd
        let recent = (item.lastOrderDate && item.lastOrderDate - today.getDate() > 14 * 86400000)

        const activeSupplier = (this.props.account.activeSuppliers.indexOf(item.supplierId) !== -1) //CHECK IF SUPPLIER IS ACTIVE - IF NOT DON'T LET ADDINg

        let priceString = 'Pricing unavailable'
        if (item.price) {
            priceString = '$' + item.price.toFixed(2) // + ' ($' + item.unitCost.toFixed(2) + ' / ' + item.units + ')'
        }

        let offerString = ''
        if (item.offer) {
            offerString = item.offer+"  ·  "
        }

        // // console.log(item);
        // // console.log(priceString);

        if (!item.displayName || item.displayName === '') {
            return (
                <>
                </>
            )
        }

        //  // console.log('PRODUCT LIST ITEM RENDERING')

        // <TextInput value={this.state.quantity} onSubmitEditing={this.setItemQty(text => parseInt(text,10))}></TextInput>
        return (
            <View style={styles.productItem}>{
                (!this.props.hideZero || this.state.quantity !== 0) &&
                <View key={item.sku}>
                    <View style={styles.row}>
                    {!!item.image  &&    
                        
                                            <View style={{ flex: 0.2, alignSelf: 'flex-start'}}>
                    
                        <Image style={styles.productImage} source={{uri:item.image}}/>                    
                    
                    </View>
                            }
                        <View style={{ flex: 0.6, alignSelf: 'flex-start', paddingRight: 3 }}>
                             {!this.props.reorderOnly &&

                                //--------- Tags------------
                               <View style={[styles.row, { justifyContent: 'flex-start' }]}>
                                    <View style={styles.tagContainer}>
                                        <Text style={[commonStyles.btnText, { fontSize: sizes.s12, fontFamily: 'medium' }]}>{item.supplierDisplayName}</Text>
                                    </View>

                                    {item.supplierItemId ?
                                        <View style={[styles.tagContainer, { marginLeft: 4, backgroundColor: 'white'  }]}>
                                            <Text style={[styles.boldText, { fontSize: sizes.s12, fontFamily: 'medium' }]}>{item.supplierItemId}</Text>
                                        </View>
                                        : <></>
                                    }
                                </View>
                             
                            } 
                            {/* -------Item name Image Price and Units------- */}
                           
                   
                            <View>
                                <Text style={[styles.text]}>{item.displayName}</Text> 
                                                          
                                {this.props.reorderOnly ?
                                    <>
                                    <View style={{ paddingTop: 2 }}>
                                            
                                    <View style={{ paddingTop: 4, paddingBottom: 4 }}>
                                        <Text style={[commonStyles.lightText, { fontSize: sizes.s12}]}><Text style={{color: '#06d6a0', fontWeight: '800'}}>{offerString}</Text>{item.qtyString}</Text>                                            
                                    </View>                                        
                                </View>
                                    <View style={[styles.row, { marginTop: 5, justifyContent: 'flex-start' }]}>
                                        <View style={[styles.addContainer, { borderRadius: 10, marginRight: 5, height: 35, padding: 9 }]}>
                                            <Text style={{ fontSize: sizes.s14, fontFamily: 'regular', color: colors.blue.primary }}>{item.quantity}{item.price && ' x $'+item.price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                        </View>
                                    
                                    </View>
                                    </>
                                    :
                                    <View style={{ paddingTop: 2 }}>

                                    <View style={{ paddingTop: 2 }}>
                                    <Text style={[commonStyles.lightText, { fontSize: sizes.s12}]}><Text style={{color: '#06d6a0', fontWeight: '800'}}>{offerString}</Text>{item.qtyString}</Text>                                            
                                </View>         
                                    
                                    {!!item.price &&
                                    <View style={{ paddingTop: 4, paddingBottom: 4 }}>
                                        <Text style={[styles.text, { fontSize: sizes.s14}]}>${item.price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>                                        
                                    </View>  
                                     }
        
                                                         
                                    </View>
                                }
                            </View>
                        
                        </View>
                        <View>
                            {this.state.quantity >= 1 &&
                                <View style={{ marginTop: 0, flex: 1 }} >
                                    {!!item.price &&
                                        <View >
                                            <Text style={styles.text, { textAlign: "right", fontFamily: "medium" }}>${(item.price * (this.props.reorderOnly ? item.quantity : this.state.quantity)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text> 
                                    
                                        </View>
                                    }

                                    {!!item.qtyPerItem && 
                                    <Text style={styles.text, { textAlign: "right", color: colors.grey.primary, fontFamily: 'regular' }}>{item.qtyPerItem * (this.props.reorderOnly ? item.quantity : this.state.quantity)} {item.package}s</Text>
                                    }
                                    </View>
                            }
                            {!activeSupplier ?
                                <View style={[styles.tagContainer,{backgroundColor:colors.background.bg}]}>
                                    <Text style={[styles.text,{color:colors.pink,fontSize:sizes.s12}]}>Supplier Inactive</Text>
                                </View>
                                :
                                <>
                                    {!this.props.reorderOnly &&
                                        <View style={{ paddingTop: 5 }}>
                                            {this.state.quantity === 0 ?
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
                                                            {/* <Text style={styles.boldText}>{this.state.quantity}</Text> */}
                                                            <TextInput 
                                                                style={[styles.boldText]}  
                                                                keyboardType={'number-pad'} 
                                                                onEndEditing={event => this.onTextSubmit(event.text)}
                                                                onChangeText={text => this.setCounterValue(text)} 
                                                                value={this.state.quantity.toString()} />
                                                        </View>
                                                        {/* ADD BUTTON */}
                                                        <TouchableOpacity style={styles.signContainer} onPress={this.addItem}>
                                                            <Text style={styles.boldText}>+</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <TouchableOpacity onPress={this.removeItem} style={{ paddingTop: 5 }}>
                                                        <Text style={[commonStyles.lightText, { color: colors.pink, textAlign: 'right', }]}>Remove Item</Text>
                                                    </TouchableOpacity>
                                                </>
                                            }

                                        </View>
                                    }
                                    {this.props.reorderOnly &&
                                        <AppButton
                                            text="Reorder"
                                            style={{ paddingHorizontal: 24, height: 35, marginVertical: 0, marginTop: 5, elevation: 0, marginHorizontal: 0, alignSelf: 'flex-end' }}
                                            textStyle={{ fontSize: sizes.s15, fontFamily: 'medium' }}
                                            onPress={() => {
                                                this.addItemQty()
                                                this.props.reorderNotification(item)
                                            }}
                                        />
                                        // <TouchableOpacity style={[styles.counterContainer, { paddingHorizontal: 20, marginTop: 15 }]}>
                                        //     <Text style={[styles.boldText, { fontSize: sizes.s15, fontFamily: 'medium' }]}>Reorder</Text>
                                        // </TouchableOpacity

                                    }
                                </>
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
            masterCart: state.cartState.masterCart,
            account: state.accountState.account
        }
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListItem)

const styles = StyleSheet.create({
    productItem: {
        backgroundColor: colors.white,
        // paddingHorizontal: 8,
        paddingBottom: 15,
        minHeight: 60
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        // fontSize: sizes.s16,
        fontSize: sizes.s14,
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
    offerText: {
        fontFamily: 'bold',
        color: '#90EE91',
        textAlign: 'center'
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
        minWidth: 40,
        borderRadius: 40,
        alignItems: 'center', justifyContent: 'center'
    },
    tagContainer: {
        backgroundColor: colors.blue.primary,
        paddingVertical: 4,
        paddingHorizontal: 11,
         borderRadius: 10,
        marginBottom: 7
    },
    supplierContainer:{
        height:34,
        borderRadius:10,backgroundColor:colors.background.bg,
        alignItems:'center',
        justifyContent:'center',
       // paddingHorizontal:10
       width:115
    },
    productImage: {
        height: 80,
        width: 80,
        resizeMode: 'contain',
        margin: 2,
        marginLeft: -7
        
      },

})

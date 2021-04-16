import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Image, TextInput  } from 'react-native';
import {connect} from 'react-redux'
import * as actions from '../../redux/actions'
// import {placeOrder} from '../../apis/apis'
import ProductList from '../Global/ProductList'

const createDaySelection = ({shippingDoW, shippingCutoff, shippingDays }) => {
    const weekdays =['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const availableDays = weekdays.filter((val, i) => shippingDoW.indexOf(i) !== -1)
    const currentTime = new Date();
    const offset = currentTime.getHours() > shippingCutoff ? 1 : 0
    const firstDay = currentTime.getDay()+shippingDays + offset 

    return Array(shippingDoW.length).fill(0).map((val, i) => {
        const day = availableDays[(firstDay+i) % availableDays.length]
        const dateOffset = firstDay+i + (firstDay+i) % availableDays.length
        const date = new Date()        

        date.setDate(currentTime.getDate() + dateOffset)
        return ( { 
                 day: day,
                 date: date
                }
        )
        })
}

export class SupplierCart extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {            
            placingOrder: false,
            orderPlaced: false,
            placeOrderError: false,
        }      
        
        this.updateOrderDetails = this.updateOrderDetails.bind(this)
    }  

    //PASS STATE UP
    updateOrderDetails = (update) => {
        this.props.updateOrderDetails({index: this.props.index, update: update})
    }

    placeOrder = () => {
        this.props.placeOrder({index: this.props.index})
    }

   render() {
        // console.log('SUPPLIER CART RENDFERING')
        // console.log(this.props.supplierOrder)
        // console.log(this.props.supplierDetail)

        const {navigation, index} = this.props         
     
        let {shippingTimeSlots} = {}
        let deliveryFee, orderTotal;
        if(this.props.supplierOrder) {
           ({deliveryFee, orderTotal} = this.props.supplierOrder)
        }      
            
        // }    
        const weekdays =['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

        const date = new Date()       

        return (  
            <View>
            <ProductList productList={this.props.supplierOrder.cart} navigation={navigation} listType="noFlatList" />
            {this.props.supplierOrder.placed ? 
                <View>
             
                </View>    
            : <View>
            {!this.props.supplierDetail ? 
                <Text>Loading Supplier Detail</Text> :                
                this.props.supplierDetail.logo && 
                <View>
                <Image 
                source={{uri: this.props.supplierDetail.logo}} 
                style={{width: 100, height: 100}}
                />  
                <Text>{this.props.supplierDetail.displayName}</Text> 
                <Text>{this.props.supplierOrder.supplierId}</Text>
                </View>                        
         }                            

            { (this.props.supplierDetail && this.props.supplierOrder) &&  
                <View>
                 <Text>{deliveryFee > 0 ? "Subtotal" : "Total"} : {orderTotal - deliveryFee}</Text>
                       {deliveryFee > 0 && 
                <View>
                <Text>Delivery Fee: {this.props.supplier.deliveryFee} </Text>
                <Text>Total: {this.props.supplier.orderTotal} </Text>
                <Text>Add {this.props.supplierDetail.orderMinimum - tiorderTotal - deliveryFee}</Text> 
                </View>
            }
                </View>
            }                    
            
            <TextInput placeholder="Enter any special notes or requests" 
                        onSubmitEditing={text => this.props.updateOrderDetails({update: {specialNotes: text}, index: index })}></TextInput>
                      
            {!this.props.supplierDetail ? 
                <Text>Loading shipping options</Text> :                
                //Select Shipping Day 
              <View>

              {this.props.supplierDetail.shippingTimeSlots.map(val => { 
                const label = 'O' + (this.props.supplierOrder.selectedDeliveryTimeSlot && 
                    this.props.supplierOrder.selectedDeliveryTimeSlot === val ? '(Selected)' : '')   
                 return (                   
                    <Text>
                    <Button 
                        title={label}
                        onPress={() => this.props.updateOrderDetails({update: {selectedDeliveryTimeSlot: val}, index: index})}
                    />
                    {val}
                    </Text>
                    )

               })

               }

              {createDaySelection(this.props.supplierDetail).map(val => {
                const label = 'O' + (this.props.supplierOrder.selectedDeliveryDate && 
                    this.props.supplierOrder.selectedDeliveryDate.day === val.day ? '(Selected)' : '')                  
                return (                   
                <Text>
                <Button 
                    title={label}
                    onPress={() => this.props.updateOrderDetails({update: {selectedDeliveryDate: val}, index: index})}
                />
                {val.day} - {val.date.getMonth()}/{val.date.getDate()}
                </Text>
                )
                })
               }

     
              </View>
                
              
            }
            )                              
            
            </View>
        }

            
            <View>
                {this.props.supplierOrder.placed ? 
                    <View>
                    <Text>Order Placed!</Text>
                    <Button 
                        title="View and Manage Order ->"
                        onPress={() => navigation.navigate("OrderDetailScreen", supplierCart)}
                    />
                    </View>
                     : <View>
                     { this.state.placingOrder ?
                            <Text>Loading Place Order</Text> :
                            <Button
                                title={"Place Order ("+this.props.supplierOrder.cart.length+")"}
                                onPress={() => this.props.placeOrder({index: this.props.index})}
                            />      
                     }      
                     </View>
                }
             </View> 
             </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {removeOrderedCart: supplierId => dispatch(actions.removeOrderedCart(supplierId))}   
}

export default connect(null,mapDispatchToProps)(SupplierCart)
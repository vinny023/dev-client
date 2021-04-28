const cartReducer = (state={}, action) => {
    switch (action.type) {
        case ('SYNC_CART'): {
            if (action.payload.state.cartState) {
                //master cart exists:
                const {masterCart} = action.payload.state.cartState     
                                
                //make sure proper shape (every supplier has a cart - if not remove supplier)
                return {...state, masterCart:masterCart.filter(supplierCart => supplierCart.cart)}     
            }
            else {
                //cart is empty
                return {...state, masterCart:[]}
            }            
        }

        case('REMOVE_ORDERED_CART'): {
            const newMasterCart = state.masterCart.filter(supplierCart => supplierCart.supplierId !== action.payload)                          
            return {...state, masterCart: newMasterCart}
        }
        
        case('SET_SHIPPING_OPTION'): {
            const {supplierId, option} = action.payload
            const newMasterCart = state.masterCart.map(supplierCart => {
                if (supplierCart.supplier.supplierId === supplierId) {
                    return {...supplierCart, shippingOption: option}
                } else {
                    return {...supplierCart}
                }
            })
            return {...state, masterCart:newMasterCart}
        }

        case ('ADD_ITEM'): {//quantity defaults to 1 if not provided, adds quantity if item already in cart
            
            //CLEAN ITEM OF EMPTY STRINGS SO IT CAN BE SAVED IN FIREBASE
            const item = clean({...action.payload.item})
                   
            let foundItem = false;
            let foundSupplier = false;
            
            const newMasterCart = state.masterCart.map(supplierCart => {

                if (supplierCart.supplierId === item.supplierId) {
                //FOUND SUPPPLIER
                foundSupplier = true;
                    
                const newCart = supplierCart.cart.map(cartItem => { 

                    if (cartItem.sku === item.sku) {
                        //FOUND SUPPPLIER & ITEM
                        foundItem = true;
                        return {...cartItem, quantity: cartItem.quantity + action.payload.amount}
                    }                
                    else {
                        return {...cartItem}
                    }
                })
    
                if (!foundItem) {
                    //FOUND SUPPPLIER BUT NEW ITEM
                    item.quantity = action.payload.amount                
                    newCart.push({...item, quantity:action.payload.amount})
                }           

                return {...supplierCart, cart: newCart}    
                
                } else {
                    return {...supplierCart}
                }           
            })

            if (!foundSupplier) {
                   //NEW SUPPPLIER 
                 newMasterCart.push({supplierId: item.supplierId, cart: [{...item, quantity:action.payload.amount}]})
            }

            return {...state, masterCart:newMasterCart}
            
        
        }
        case ('SUBTRACT_ITEM'): {         
            const item = {...action.payload.item}

            let removeSupplierIndex = -1;
            let removeItemIndex = -1;

            let temp;
            const newMasterCart = state.masterCart.map((supplierCart,j) => {  
                let newCart = [...supplierCart.cart]
                
               if (item.supplierId === supplierCart.supplierId) {
                newCart = supplierCart.cart.map((cartItem,i) => {                   
       
                    if (cartItem.sku === item.sku) {
                        if (cartItem.quantity - action.payload.amount <= 0) {
                            removeItemIndex = i;
                        }
                        return {...cartItem, quantity: cartItem.quantity - action.payload.amount}
                    }                
                    else {
                        return {...cartItem}
                    }
                })

                if (removeItemIndex !== -1) {
                    // let testCart=newCart;
                    // console.log(testCart,"NEW CART")
                    temp = newCart.splice(removeItemIndex,1)
                    console.log('temp', temp);
                    // console.log(newCart,"NEW CART IS THIS")
                    if (newCart.length === 0) {
                        removeSupplierIndex = j
                    }
                }
            } 

                return {...supplierCart, cart: newCart}
            })

            console.log('INITIAL MASTERCART')
            console.log(state.masterCart)
            console.log('MASTERCAR TBVEFOFE SUPPLIER SPLICE')
            console.log(newMasterCart)
            console.log('REMOVE SUPPLIER INDEX')
            console.log(removeSupplierIndex)

            if (removeSupplierIndex !== -1) {
                newMasterCart.splice(removeSupplierIndex,1)
            }

            // console.log('MASTERCART AFTER SPLICE')
            console.log(newMasterCart, 'MASTERCART AFTER SPLICE')
                    
            // return {...state, masterCart: newMasterCart} 
            return {masterCart: newMasterCart};
            
        }

        default:
            return state;
    }

}

const clean = (obj) => {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }
    }
    return obj
  }

export default cartReducer
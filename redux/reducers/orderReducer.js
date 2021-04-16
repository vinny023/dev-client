const orderReducer = (state={}, action) => {
    switch (action.type) {
        case ('PLACE_ORDER'): {
            
            return {...state, orders:[...state.orders, ...action.payload]}
        }
        
        default:
            console.log("DEFAULT ORDER REDUCER")
            return state; 
    }
}

export default orderReducer 
const orderReducer = (state={ orders: [] }, action) => {
    console.log(action);
    switch (action.type) {
        case ('PLACE_ORDER'): {   
            return { ...state, orders:[...state.orders, ...action.payload] }
        }
        case ('SET_ORDERS'): {
            return { ...state, orders: action.payload }
        }
        default:
            console.log("DEFAULT ORDER REDUCER")
            return state; 
    }
}

export default orderReducer 
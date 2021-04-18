const accountReducer = (state={}, action) => {
    switch (action.type) {
        case 'SET_ACCOUNT':
            return {...state, account: action.payload}
        
        default:
            return state; 
    }
}

export default accountReducer
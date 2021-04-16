import { combineReducers } from 'redux';
import cartReducer from './cartReducer'
import orderReducer from './orderReducer'
import accountReducer from './accountReducer'
import fetchReducer from './fetchReducer'

const rootReducer = combineReducers(
    {accountState: accountReducer, 
    cartState:cartReducer})

export default rootReducer
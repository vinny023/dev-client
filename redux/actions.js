import fetch from 'isomorphic-fetch'
import { AsyncStorage } from 'react-native';

//ACCOUNT ACTIONS
export const setAccount = account => {
    return ({
        type: 'SET_ACCOUNT',
        payload: account
    })
}

//CART ACTIONS
export const setShippingOption = ({supplierId, option}) => {
    return ({
     type: 'SET_SHIPPING_OPTION',
     payload: {supplierId:supplierId, option:option}
    })
}

export const addItem = addItemProps => {
    return ({
     type: 'ADD_ITEM',
     payload: addItemProps
    })
}

export const subtractItem = subtractItemProps => {
    return ({
     type: 'SUBTRACT_ITEM',
     payload: subtractItemProps
    })
}

export const removeOrderedCart = supplierId => {

    return ({
        type: 'REMOVE_ORDERED_CART',
        payload: supplierId
    })
}









// //FETCH ACTIONS
// export const fetchAction = () => dispatch => {

//     dispatch(fetchBegin())
//     return fetch('https://api.coingecko.com/api/v3/exchange_rates')     
//         .then(res => res.json())
//         .then(json => {
//             dispatch(fetchSuccess(json));

//     })
//     .catch(error => dispatch(fetchFailure(error)));

//     //DECISION TREE TO HANDLE UPDATES...
// }

// export const fetchBegin = () => ({
//     type: 'FETCH_BEGIN'
//   });
  
//   export const fetchSuccess = data => ({
//     type: 'FETCH_SUCCESS',
//     payload: data
//   });
  
//   export const fetchProductsFailure = error => ({
//     type: 'FETCH_FAILURE',
//     payload: error
//   });


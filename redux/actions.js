import fetch from 'isomorphic-fetch'
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import {getOrders} from '../apis/apis';

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

export const updateOrderDetails = props => {
    console.log('ACTION UPDATE SUPPLIE RRUGNNING')
    return ({
        type: 'UPDATE_ORDER_DETAILS',
        payload: props
    })
}

export const removeOrderedCart = supplierId => {
    return ({
        type: 'REMOVE_ORDERED_CART',
        payload: supplierId
    })
}

export const getOrdersFromDb = async () => {
    try {
        alert('Fetching data!');
        const dataFromStorage = await AsyncStorage.getItem('accountId');
        if (dataFromStorage) {
            const orders = await getOrders({query: {
                accountId: JSON.parse(dataFromStorage)
            }, sort: { createdDate: -1 }});
            alert('Data fetched!');
            return ({
                type: 'SET_ORDERS',
                payload: orders
            })
        }
    } catch (err) {
        console.log('error in getting orders', err);
    }
    return ({
        type: 'SET_ORDERS',
        payload: []
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


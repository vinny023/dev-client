import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/rootReducer'
import logger from 'redux-logger'
import firebaseApp from '../firebaseConfig'
import {isEqual, keys} from 'lodash'

import * as data from '../databaseMock'

const initialState = {

    accountState: {
      account: data.myRestaurantAccount
    },

    cartState: {
      masterCart: []
    }

}

const store = createStore(rootReducer, initialState, applyMiddleware(thunk, logger))


//THIS INITIALIZATION SHOULD HAPPEN ON LOGIN...
//*************STILL NEED TO ADD LISTENER OFFLINE CODE https://medium.com/@aakashns/connecting-firebase-and-redux-575f8294332d
//CONNECT FIREBASE RTMDB TO STORE
// const db = firebaseApp.database();
// store.subscribe(() => syncCartStateToDB({cart:'cart'}, firebaseApp.database()))

let shouldWrite = true;

//WRITE CHANGES TO FIREBASE
store.subscribe(() => {
  if (shouldWrite) {
    console.log('customers/'+store.getState().accountState.account.id)
    console.log(store.getState())
    firebaseApp.database().ref('customers/'+store.getState().accountState.account.id).set({
      state: store.getState()
    })
  }
})

//LISTEN TO FIREBASE FOR STATE CHAGNES
firebaseApp.database().ref('customers/'+store.getState().accountState.account.id).on('value', data => {

  //checks if accountid exists, if state exists and if shape of Firebase state is the same as the current state (which comes from Strapi or local)
  if (!data.val() || !data.val().state   || !isEqual(keys(data.val().state), keys(store.getState()))) { 
    return;
  } 

  shouldWrite = false;
  store.dispatch({
      type: 'SYNC_CART',
      payload: data.val()
  })
  shouldWrite = true;
})


export default store
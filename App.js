import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import store from './redux/store'

// import * as eva from '@eva-design/eva';
// import { ApplicationProvider} from '@ui-kitten/components';
import firebaseApp from './firebaseConfig'

import { Provider } from 'react-redux'
import Navigation from './navigation/Navigation'

import syncCartStateToDB from './redux/firebaseActions'


export default function App() {
    
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>

    );
}



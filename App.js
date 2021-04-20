import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import store from './redux/store'
import {useFonts} from 'expo-font'
// import * as eva from '@eva-design/eva';
// import { ApplicationProvider} from '@ui-kitten/components';
import firebaseApp from './firebaseConfig'

import { Provider } from 'react-redux'
import Navigation from './navigation/Navigation'

import syncCartStateToDB from './redux/firebaseActions'


export default function App() {
  //Custom fonts
  const [loaded] = useFonts({
    regular: require('./assets/fonts/Roboto.ttf'),
    medium: require('./assets/fonts/Roboto_medium.ttf'),
    bold: require('./assets/fonts/Roboto-Bold.ttf'),
  });
  if (!loaded) {
    return null;
  }
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>

    );
}



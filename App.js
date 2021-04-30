import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View ,Image} from 'react-native';
import store from './redux/store'
import {useFonts} from 'expo-font'
// import * as eva from '@eva-design/eva';
// import { ApplicationProvider} from '@ui-kitten/components';
import firebaseApp from './firebaseConfig'
import FlashMessage from 'react-native-flash-message'
import { Provider } from 'react-redux'
import Navigation from './navigation/Navigation'
//import * as Sentry from 'sentry-expo';
import syncCartStateToDB from './redux/firebaseActions'

// Sentry.init({
//   dsn: "https://801dcaccf1754731ac6162c4603087ad@o578775.ingest.sentry.io/5735190",
//   enableInExpoDevelopment: true,
//   debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
// });
//"@sentry/react-native": "^2.4.1",
//"sentry-expo": "^3.1.0",



export default function App() {
  //Custom fonts
  
  const [loaded,err] = useFonts({
    regular: require('./assets/fonts/Roboto-Regular.ttf'),
    medium: require('./assets/fonts/Roboto-Medium.ttf'),
    bold: require('./assets/fonts/Roboto-Bold.ttf'),
  });
  if (!loaded) {
    return null;
  }
 
    return (
      <Provider store={store}>
        <Navigation />
        <FlashMessage position="top" />
      </Provider>

    );
}



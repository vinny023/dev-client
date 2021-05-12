import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


//Place Order Tab SCREENS
import LoginScreen from '../screens/placeOrderTab/LoginScreen'
import OrderScreen from '../screens/placeOrderTab/OrderScreen'
import TestPropsScreen from '../screens/placeOrderTab/TestPropsScreen'
import ProductDetailScreen from '../screens/placeOrderTab/ProductDetailScreen'
import CartScreen from '../screens/placeOrderTab/CartScreen'

//HEADER BUTTONS
import CartButton from '../components/Global/CartButton'

//Manage Order Tab SCREENS
import ViewOrderScreen from '../screens/manageOrderTab/ViewOrderScreen'
import OrderDetailScreen from '../screens/manageOrderTab/OrderDetailScreen'
import { colors, commonStyles, sizes } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { syncCartStateToDB } from '../redux/firebaseActions'
import { useDispatch } from 'react-redux';
import { db } from '../firebaseConfig';

const OrderTabStack = createStackNavigator();
const Stack = createStackNavigator();

const myScreenOptions = {
  headerRight: () => <CartButton />,
}
const headerStyling = { backgroundColor:colors.background.light, elevation: 0, shadowOpacity: 0 }
const titleStyle = { fontSize: sizes.s20 + 1, fontFamily: 'bold', color: colors.text, }

const PlaceOrderTab = () => {
  return (
    <OrderTabStack.Navigator
      screenOptions={{ headerShown: true, headerStyle: headerStyling, headerTitleStyle: titleStyle, }}>
      {/* <OrderTabStack.Screen name="LoginScreen" component={LoginScreen} options={{ header: () => null, }} /> */}
      <OrderTabStack.Screen name="OrderScreen" component={OrderScreen} options={{ headerTitle: 'Browse Items', headerLeft: () => null, headerRight: () => <CartButton />, headerTitleAlign: 'left' }} />
      <OrderTabStack.Screen name="CartScreen" component={CartScreen} options={{ headerTitle: 'Place Order', headerRight: () => <CartButton />, headerTitleAlign: 'center', }} />
      <OrderTabStack.Screen name="ViewOrderScreen" component={ViewOrderScreen} options={myScreenOptions, { headerTitle: 'Manage Orders', headerRight: () => <CartButton /> }} />
      <OrderTabStack.Screen name="OrderDetailScreen" component={OrderDetailScreen} options={{ headerTitle: null }} />
      <OrderTabStack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={myScreenOptions} />
      <OrderTabStack.Screen name="TestPropsScreen" component={TestPropsScreen} options={myScreenOptions} />
    </OrderTabStack.Navigator>
  )
}

const ManageOrderTab = () => {
  return (
    <OrderTabStack.Navigator screenOptions={{ headerShown: true, headerStyle: headerStyling, headerTitleStyle: titleStyle}}>
      <OrderTabStack.Screen name="ViewOrderScreen" component={ViewOrderScreen} options={myScreenOptions, { headerTitle: 'Manage Orders',headerLeft: () => null, headerRight: () => <CartButton /> }} />
      <OrderTabStack.Screen name="OrderDetailScreen" component={OrderDetailScreen} options={{ headerTitle: null, headerRight: () => <CartButton /> }} />
      <OrderTabStack.Screen name="CartScreen" component={CartScreen} options={{ headerTitle: 'Place Order', headerRight: () => <CartButton />, headerTitleAlign: 'center' }} />
    </OrderTabStack.Navigator>
  )
}

//const Tab = createBottomTabNavigator();
const Tab = createMaterialTopTabNavigator();

const Tabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        let imageName;
        let imageType;
        if (route.name === 'Shop & Order') {
          imageType = 'bag'
          imageName = focused ? require('../assets/shopping-bag-black.png') : require('../assets/shopping-bag.png');
        } else if (route.name === 'Track & Manage') {
          imageType = 'truck'
          imageName = focused ? require('../assets/truck-black.png') : require('../assets/truck-grey.png');
        }
        return <Image source={imageName} style={{ marginTop: 7, width: imageType === 'bag' ? 19 : 30, height: imageType === 'bag' ? 22 : 31 }} resizeMode={'contain'} />;
      },
    })}

    tabBarPosition={'bottom'}
    tabBarOptions={{
      activeTintColor: colors.text,
      inactiveTintColor: colors.grey.light,
      labelStyle: { fontSize: sizes.s13, fontFamily: 'medium', textTransform: 'none' },
      showLabel: true,
      showIcon: true,
      tabStyle: { height: 60, paddingBottom: 10 },
      allowFontScaling: true,
      keyboardHidesTabBar: true,
      renderIndicator: () => null
    }}>
    <Tab.Screen name="Shop & Order" component={PlaceOrderTab} />
    <Tab.Screen name="Track & Manage" component={ManageOrderTab} />
  </Tab.Navigator>
)
export default function Navigation() {
  // const dispatch = useDispatch();

  // React.useEffect(() => {
  //   async function syncDataWithDb () {
  //     const data = await AsyncStorage.getItem('accountId');
  //     if (data) {
  //       syncCartStateToDB(db, dispatch, JSON.parse(data));
  //     }
  //   }
  //   syncDataWithDb()
  // }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>

  )

}


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
import CBack from '../components/Global/CBack';

const OrderTabStack = createStackNavigator();
const Stack = createStackNavigator();

const myScreenOptions = {
  headerRight: () => <CartButton />,
  headerLeft:()=> (<CBack />),
  headerBackTitleVisible: false
}
const headerStyling = { backgroundColor:colors.background.light, elevation: 0, shadowOpacity: 0,}
const titleStyle = { fontSize: sizes.s25 + 1, fontFamily: 'bold', color: colors.text,paddingLeft:10, }
const arrowStyles={position:'absolute',top:-5,bottom:60,left:18}
const PlaceOrderTab = () => {
  return (
    <OrderTabStack.Navigator
      screenOptions={{ headerShown: true, headerStyle: headerStyling, headerTitleStyle: titleStyle,headerStatusBarHeight:90,headerLeftContainerStyle:arrowStyles,headerTitleContainerStyle:{left:10}}}>
      {/* <OrderTabStack.Screen name="LoginScreen" component={LoginScreen} options={{ header: () => null, }} /> */}

      <OrderTabStack.Screen name="OrderScreen" component={OrderScreen} options={{headerTitle:"Browse Items", headerLeft: () => null, headerRight: () => <CartButton />, headerTitleAlign: 'left',  headerBackTitleVisible: false }} />

      <OrderTabStack.Screen name="ViewOrderScreen" component={ViewOrderScreen} options={{ headerTitle: 'Manage Orders', headerTitleAlign: 'left',  headerRight: () => <CartButton />,  headerBackTitleVisible: false,headerLeft:()=> (<CBack/>) }}  />
      <OrderTabStack.Screen name="OrderDetailScreen" component={OrderDetailScreen} options={{ headerTitle: 'Order Details',  headerTitleAlign: 'left',  headerRight: () => <CartButton /> , headerBackTitleVisible: false,headerLeft:()=> (<CBack/>) }} />
      <OrderTabStack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={myScreenOptions} />
      <OrderTabStack.Screen name="TestPropsScreen" component={TestPropsScreen} options={myScreenOptions} />
    </OrderTabStack.Navigator>
  )
}

const CartTab = () => {
  return (
    <OrderTabStack.Navigator 
    screenOptions={{ headerShown: true, headerStyle: headerStyling, headerTitleStyle: titleStyle,headerStatusBarHeight:90,headerLeftContainerStyle:arrowStyles,headerTitleContainerStyle:{left:10}}}>
    <OrderTabStack.Screen name="CartScreen" component={CartScreen} options={{ headerTitle: 'Place Order', headerRight: () => <CartButton />, headerTitleAlign: 'left',  headerBackTitleVisible: false,  headerLeft:()=> (<CBack/>),
  }} />   
    </OrderTabStack.Navigator>
  )
}

const ManageOrderTab = () => {
  return (
    <OrderTabStack.Navigator 
    screenOptions={{ headerShown: true, headerStyle: headerStyling, headerTitleStyle: titleStyle,headerStatusBarHeight:90,headerLeftContainerStyle:arrowStyles,headerTitleContainerStyle:{left:10}}}>
      <OrderTabStack.Screen name="ViewOrderScreen" component={ViewOrderScreen} options={{ headerTitle: 'Manage Orders',headerLeft: () => null, headerRight: () => <CartButton />,  headerTitleAlign: 'left', headerBackTitleVisible: false }} />
      <OrderTabStack.Screen name="OrderDetailScreen" component={OrderDetailScreen} options={{ headerTitle: 'Order Details',  headerTitleAlign: 'left', headerRight: () => <CartButton /> ,  headerBackTitleVisible: false,headerLeft:()=> (<CBack/>)}} /> 
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
        let width;
        let height;

        if (route.name === 'Order') {
          imageType = 'order'
          imageName = focused ? "https://i.ibb.co/wRKmqZ2/Untitled-presentation-9.png" : "https://i.ibb.co/3WjxcQ9/Untitled-presentation-7.png";
          width = 25
          height = 25

        } else if (route.name === 'Manage') {
          imageType = 'truck'
          imageName = focused ? "https://i.ibb.co/Pr3zDxG/Untitled-presentation-11.png" : "https://i.ibb.co/xGBNKPj/Untitled-presentation-6.png";
          width = 30
          height = 30

        } else if (route.name === "Checkout") {
          imageType = 'bag'
          imageName = focused ? "https://i.ibb.co/QYRTMMC/Untitled-presentation-10.png" : "https://i.ibb.co/C1tQcH1/Untitled-presentation-8.png";
          width = 25 
          height = 25

        }



        return <Image source={{uri:imageName}} style={{ marginTop: 7, width: width, height: height, marginBottom: 5 }} resizeMode={'contain'} />;
      },
    })}
    animiationEnabled={true}
    // screenOptions={{lazy: false}}
    tabBarPosition={'bottom'}
    tabBarOptions={{
      activeTintColor: colors.text,
      inactiveTintColor: colors.grey.light,
      labelStyle: { fontSize: sizes.s13, fontFamily: 'medium', textTransform: 'none' },
      showLabel: true,
      showIcon: true,
      tabStyle: { height: 80, paddingBottom: 40 },
      allowFontScaling: true,
      keyboardHidesTabBar: true,
      renderIndicator: () => null
    }}
    >
    <Tab.Screen name="Order" component={PlaceOrderTab} />
    <Tab.Screen name="Checkout" component={CartTab} />
    <Tab.Screen name="Manage" component={ManageOrderTab} />
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


import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


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
import { colors } from '../theme';

const OrderTabStack = createStackNavigator();

const myScreenOptions = {

  headerRight: () => <CartButton />,

}
const headerStyling = { backgroundColor: colors.background.primary, elevation: 0 }
const PlaceOrderTab = () => {
  return (
    <OrderTabStack.Navigator screenOptions={{ headerShown: true, headerStyle: headerStyling }}>
      <OrderTabStack.Screen name="LoginScreen" component={LoginScreen} />
      <OrderTabStack.Screen name="OrderScreen" component={OrderScreen} options={myScreenOptions} />
      <OrderTabStack.Screen name="CartScreen" component={CartScreen} options={myScreenOptions} />
      <OrderTabStack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={myScreenOptions} />
      <OrderTabStack.Screen name="TestPropsScreen" component={TestPropsScreen} options={myScreenOptions} />
    </OrderTabStack.Navigator>
  )
}

const ManageOrderTab = () => {
  return (
    <OrderTabStack.Navigator screenOptions={{ headerShown: true, headerStyle: headerStyling }}>
      <OrderTabStack.Screen name="OrderDetailScreen" component={OrderDetailScreen} options={myScreenOptions} />
      <OrderTabStack.Screen name="View All Orders" component={ViewOrderScreen} options={myScreenOptions} />
      <OrderTabStack.Screen name="CartScreen" component={CartScreen} options={myScreenOptions} />
    </OrderTabStack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Shop" component={PlaceOrderTab} />
        <Tab.Screen name="Track & Manage" component={ManageOrderTab} />
      </Tab.Navigator>
    </NavigationContainer>

  )

}


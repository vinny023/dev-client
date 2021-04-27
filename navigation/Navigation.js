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
import { colors, commonStyles, sizes } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';

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
    
    <OrderTabStack.Screen name="ViewOrderScreen" component={ViewOrderScreen} options={myScreenOptions} />  
      <OrderTabStack.Screen name="OrderDetailScreen" component={OrderDetailScreen} options={myScreenOptions} />      
      <OrderTabStack.Screen name="CartScreen" component={CartScreen} options={myScreenOptions} />
    </OrderTabStack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused}) => {
          let imageName;
          if (route.name === 'Shop & Order') {
            imageName = focused ? require('../assets/shopping-bag-black.png') : require('../assets/shopping-bag.png');
          } else if (route.name === 'Track & Manage') {
            imageName = focused ? require('../assets/truck-black.png')        : require('../assets/truck-grey.png');
          }
          return <Image source={imageName} style={{ marginTop: 10 }} />;
        },
      })}
        tabBarOptions={{
          activeTintColor   : colors.text,
          inactiveTintColor : colors.grey.light,
          labelStyle        : { fontSize: sizes.s13, fontFamily: 'medium', marginBottom: 8 },
          style             : { height: 60 }
        }}>
        <Tab.Screen name="Shop & Order" component={PlaceOrderTab} />
        <Tab.Screen name="Track & Manage" component={ManageOrderTab} />
      </Tab.Navigator>
    </NavigationContainer>

  )

}


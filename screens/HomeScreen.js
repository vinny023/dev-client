import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet, View, Text, Button } from 'react-native';

import Counter from  '../components/Counter'


function HomeScreen({ navigation }) {
    return(
      <View style={{flex: 1, flexDirection: 'column', alignItems:'center', justifyContent:'center'}}>
        <Text category="h4">HomeScreen</Text>
        <Counter />
        <Button
          title="Go To Details"
          onPress={() => navigation.navigate('Details', {itemId: 86})}
        />
      </View>
    )
  }

  export default HomeScreen
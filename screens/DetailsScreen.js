import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet, View, Text, Button } from 'react-native';

import Counter from  '../components/Counter'


function DetailsScreen({ route, navigation }) {

    // const {itemId} = route.params

    return(
      <View style={{flex: 1, flexDirection: 'column', alignItems:'center', justifyContent:'center'}}>
        <Text category="h4">Details</Text>
        <Counter />
        
        <Button
        title="Go To Details... Again"
        onPress={() => navigation.push('Details')}
        />
      </View>
    )
  }

  export default DetailsScreen
import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { View, Text } from 'react-native';


function TestPropsScreen({route}) {
    const {type, text} = route.params.screenProps
    return(
     <View>
        <Text>{text}</Text>
      </View>
    )
  }

  export default TestPropsScreen
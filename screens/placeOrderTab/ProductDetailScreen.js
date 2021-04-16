import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { View, Text } from 'react-native';


function ProductDetailScreen({route}) {
    const {name, description} = route.params
    return(
     <View>
     
        <Text>{name}</Text>
        <Text>{description}</Text>
      </View>
    )
  }

  export default ProductDetailScreen
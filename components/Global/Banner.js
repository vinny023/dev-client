import React from 'react';
import {View, Text, Button} from 'react-native';

export default class Banner extends React.Component  {    

    constructor(props) {
        super(props)
    }
    render() {
        const {show, type, message} = this.props.banner
        return (
            <View>
            { show && 
                <View>
                <Text>{message}</Text>
                <Button
                    title="X"
                    onPress={() => this.props.hideBanner()}    
                />
                </View>
                 }                
            </View>                
        )
        
    }

}    


import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { Button } from 'react-native';

export default class OrderScreen extends React.Component {  

    render() {
        return (
            <>
                <Button 
                    onPress={() => this.props.setMode('Order Guide')} 
                    title="Order Guide"
                />
                <Button 
                    onPress={() => this.props.setMode('Catalog')} 
                    title="Catalog"
                />                                               
            </>
        )
    }

}
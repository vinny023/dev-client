import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { Button, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, sizes } from '../../theme';

export default class OrderScreen extends React.Component {

    render() {
        return (
            <>
                <View style={styles.container}>
                    <TouchableOpacity style={this.props.mode === 'Order Guide' ? [styles.switchModeContainer, { backgroundColor: colors.white }] : [styles.switchModeContainer, { backgroundColor: '#E7EAEC' }]} onPress={() => this.props.setMode('Order Guide')}>
                        <Text style={this.props.mode === 'Order Guide' ? styles.switchMode : styles.switchMode}>Order Guide</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={this.props.mode === 'Browse Full Catalog' ? [styles.switchModeContainer, { backgroundColor: colors.white }] : [styles.switchModeContainer, { backgroundColor: '#E7EAEC' }]} onPress={() => this.props.setMode('Catalog')}>
                        <Text style={this.props.mode === 'Browse Full Catalog' ? styles.switchMode : styles.switchMode} >Catalog</Text>
                    </TouchableOpacity>
                </View>

            </>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // padding:10,
        marginTop: 15,
      
    },
    switchModeContainer: {
        width: '48%',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#E7EAEC',
        borderRadius:10
    },
    switchMode: {
        fontSize: sizes.s15,
        fontFamily: 'medium',
        
    },
    
})
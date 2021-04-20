import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { Button, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, sizes } from '../../theme';

export default class OrderScreen extends React.Component {

    render() {
        return (
            <>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.switchModeContainer, { backgroundColor: '#E7EAEC' }]} onPress={() => this.props.setMode('Order Guide')}>
                        <Text style={[styles.switchMode,{color:colors.black}]}>Order Guide</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.switchModeContainer, { backgroundColor: colors.white, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }]} onPress={() => this.props.setMode('Catalog')}>
                        <Text style={[styles.switchMode,{color:colors.grey.primary}]} >Catalog</Text>
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
        borderRadius: 10
    },
    switchModeContainer: {
        width: '48%',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    switchMode: {
        fontSize: sizes.s15,
         fontFamily: 'medium',
    },
  
})
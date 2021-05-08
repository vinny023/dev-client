import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { Button, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, sizes } from '../../theme';

export default class OrderScreen extends React.Component {

    render() {
        return (
            <>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.switchModeContainer, this.props.mode === 'Order Guide' ? styles.activeOrderGuide : styles.inactiveOrderGuide]}
                        onPress={() => this.props.setMode('Order Guide')}>
                        <Text style={[styles.switchMode, { color: this.props.mode === 'Order Guide' ? colors.text : colors.grey.primary }]}>Order Guide</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        //
                        style={[styles.switchModeContainer, this.props.mode === 'Browse Full Catalog' ? styles.activeCatalog : styles.inactiveCatalog]}
                        onPress={() => this.props.setMode('Catalog')}>
                        <Text style={[styles.switchMode, { color: this.props.mode === 'Browse Full Catalog' ? colors.text : colors.grey.primary }]} >Catalog</Text>
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
        top: 5,

        marginBottom: 18

    },
    switchModeContainer: {
        width: '48%',
        paddingVertical: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        position: 'absolute',

    },
    switchMode: {
        fontSize: sizes.s14,
        fontFamily: 'medium',

    },
    activeOrderGuide: {
        backgroundColor: colors.white,
        left: 0,
        zIndex: 40,
        marginRight: '43%'
    },
    inactiveOrderGuide: {
        backgroundColor: '#E7EAEC',
        left: 0,
        zIndex: -30
    },
    activeCatalog: {
        backgroundColor: colors.white,
         right: 0, 
         zIndex: 40, 
         marginLeft: '43%'
    },
    inactiveCatalog: { backgroundColor: '#E7EAEC', right: 0, zIndex: 30 }


})
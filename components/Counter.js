import React from 'react';
// import { Layout, State, Text } from '@ui-kitten/components';
import { StyleSheet, View, Text, Button } from 'react-native';
import {connect} from 'react-redux'
import {incrementAction} from '../redux/actions'

class Counter extends React.Component {

    render() {
        return (
            <View style={{flex: 1, flexDirection:'column'}}>
            <Text>counter: {this.props.counter}</Text>
            <Button
            title="+1"
            onPress={this.props.increment}
            />
            </View>
        ) 
    }
}

const mapStateToProps = state => {return {counter: state.counterState.counter}}
const mapDispatchToProps = dispatch => {return {increment: () => dispatch(incrementAction())}}

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
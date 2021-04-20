import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';

export default class Banner extends React.Component {

    constructor(props) {
        super(props)
    }
    render() {
        const { show, type, message } = this.props.banner
        return (
            <View>
                { show &&
                    <View style={{ backgroundColor: colors.white, padding: 10 }}>
                        <TouchableOpacity onPress={() => this.props.hideBanner()} style={{ alignSelf: 'flex-end' }}>
                            <Ionicons name={'close'} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={{ alignSelf: 'center' }}>{message}</Text>
                        {/* <Button
                            title="X"
                            onPress={() => this.props.hideBanner()}    
                          /> */}
                    </View>
                }
            </View>
        )

    }

}


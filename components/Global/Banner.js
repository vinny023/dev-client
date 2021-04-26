import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import RNRestart from 'react-native-restart'; 


export default class Banner extends React.Component {

    constructor(props) {
        super(props)
    }

    // buttonAction = () => {
    //     const {buttonAction} = this.props.banner
    //     switch(buttonAction.title) {
    //         case 'Refresh':
    //             console.log('TRYING TO REFRESH')
    //             RNRestart.Restart();
    //     }
    // }

    // {(buttonAction && buttonAction.title) &&
    //     <Button 
    //         title={buttonAction.title} 
    //         onPress={() => this.buttonAction()}
    //         />
    // }

    render() {
        const { show, type, message, buttonAction } = this.props.banner      
       
        return (
            <View>
                { show  &&

                    <View style={{ backgroundColor: colors.white, padding: 10 }}>
                        <TouchableOpacity onPress={() => this.props.hideBanner()} style={{ alignSelf: 'flex-end' }}>
                            <Ionicons name={'close'} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={{ alignSelf: 'center',fontFamily:'regular' }}>{message}</Text>              

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


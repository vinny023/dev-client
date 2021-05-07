import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, commonStyles, sizes } from '../../theme';
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

        if (show && message != "Banner") {
            showMessage({
                type: type,
                message: message,
                description: message.includes('Order has been placed') ? "Tap here to view order" : '',
                backgroundColor: type === "error" ? colors.pink : type === 'success' ? colors.green : type === 'message' ? colors.blue.light : colors.pink, // background color
                autoHide: false,
                statusBarHeight: 30,
                titleStyle:commonStyles.bannerTitle,
                textStyle: commonStyles.bannerText,
                style: styles.banner,
                //default duration:1850
                duration:1400,
                color:type === 'message' ? colors.blue.primary : colors.white 
            })
        }
        return (
            <View>
                { show &&
                    <View >
                        {/*
                         style={[commonStyles.card,{position:'absolute',top:-35,display:'flex',zIndex:5,overflow:'visible',backgroundColor:colors.pink,flex:1,width:'100%'}]} 
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

const styles = StyleSheet.create({
    banner: {
        opacity: 1,
        paddingVertical:28,
        elevation:3,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {
          width: 0,
          height: 4
        },

    },
    bannerTitle: {
        fontSize: sizes.s14,
        //  fontSize:sizes.s16,
        fontFamily: 'regular',
        color: colors.white,
        textAlign: 'center',
       
    }

})
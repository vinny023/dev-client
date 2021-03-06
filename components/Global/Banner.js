import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { colors, commonStyles, sizes } from '../../theme';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import RNRestart from 'react-native-restart';
import _ from 'lodash'


export default class Banner extends React.Component {

    constructor(props) {
        super(props)
    }

    // buttonAction = () => {
    //     const {buttonAction} = this.props.banner
    //     switch(buttonAction.title) {
    //         case 'Refresh':
    //             // console.log('TRYING TO REFRESH')
    //             RNRestart.Restart();
    //     }
    // }

    // {(buttonAction && buttonAction.title) &&
    //     <Button 
    //         title={buttonAction.title} 
    //         onPress={() => this.buttonAction()}
    //         />
    // }
    runBannerAction = () => {
        let { show, type, message, action, actionParam, duration } = this.props.banner
        if (this.props.bannerAction) {
            this.props.bannerAction(action, actionParam)
        } else {
            this.props.hideBanner()
        }

    }
  
    shouldComponentUpdate(nextProps) {
        return (!_.isEqual(nextProps, this.props))
    }

    render() {

        // console.log('BANNER MESSAGE');


        let { show, type, message, action, actionParam, duration } = this.props.banner
        // // console.log(message);
        
        if (!duration) {
            duration = 2000
        }
        if (show && message!= 'Banner' ) {
            showMessage({
                type: type,
                message: message,
                // description: message.includes('Order has been placed') ? "Tap here to view order" : '',
                backgroundColor: type === "error" ?'rgba(244, 85, 152, 0.96)': type === 'success' ? 'rgba(37, 240, 167, 0.96)' : type === 'message' ? colors.blue.light : colors.pink, // background color
                // autoHide: false,
               // statusBarHeight: 50,
                titleStyle: commonStyles.bannerTitle,
                textStyle: commonStyles.bannerText,
                style: styles.banner,
                //default duration:1850a
                duration: duration,
                color: type === 'message' ? colors.blue.primary : colors.white,
                onPress: () => this.runBannerAction()
            })
        }

        setTimeout(() => this.props.hideBanner(), duration)
        
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
        paddingVertical: 28,
        elevation: 3,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
            width: 0,
            height: 4,  
        },
       //top:0,
       shadowRadius:10
    },
    bannerTitle: {
        fontSize: sizes.s14,
        fontFamily: 'regular',
        color: colors.white,
        textAlign: 'center',
        textAlignVertical:'center'


    }

})
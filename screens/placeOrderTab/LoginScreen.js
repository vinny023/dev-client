import React from 'react'
import { View, Text, Button, TextInput } from 'react-native';
import Banner from '../../components/Global/Banner'
import { connect } from 'react-redux'
import store from '../../redux/store'
import firebaseApp from '../../firebaseConfig'
import * as actions from '../../redux/actions.js'
import * as data from '../../databaseMock'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccount } from '../../apis/apis'
import _ from 'lodash'
import AppButton from '../../components/Global/AppButton';
import { colors, commonStyles, sizes } from '../../theme';
import { showMessage, hideMessage } from "react-native-flash-message";



const syncStore = ({ accountId }) => {
    let shouldWrite = false;

    //WRITE CHANGES TO FIREBASE
    store.subscribe(() => {
        if (shouldWrite) {
        console.log('writing to firebase')
        console.log(store.getState())
            firebaseApp.database().ref('customers/' + accountId).set({
                state: store.getState()
            })
        }
    })

    //LISTEN TO FIREBASE FOR STATE CHAGNES
    firebaseApp.database().ref('customers/' + accountId).on('value', data => {

        //checks if accountid exists, if state exists and if shape of Firebase state is the same as the current state (which comes from Strapi or local)
        //   if (!data.val() || !data.val().state   || !isEqual(keys(data.val().state), keys(store.getState()))) { 
        if (!data.val() || !data.val().state) {
            return { error: 500 };
        }

        shouldWrite = false;
        store.dispatch({
            type: 'SYNC_CART',
            payload: data.val()
        })
        shouldWrite = true;
    })

}

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
        return { success: 'success' }
    } catch (e) {
        console.log('store data error')
        return { error: e }
    }
}

const getData = async (key) => {
    try {
        return await AsyncStorage.getItem(key)
    } catch (e) {
        return undefined
    }

}



export class LoginScreen extends React.Component {


    constructor(props) {
        super(props)

        this.state = {
            banner: { show: false, type: '', message: '' },
            accountId: '',
            code: '',
            getAccountLoading: false
        }

    }

    manualLogin = async () => {
        // ADD QUERY VALIDATION - [TAG]

        try {
            this.setState({
                getAccountLoading: true,
                banner: { show: true, type: 'message', message: "Verifying your unique codee... " }
            })
            const account = await getAccount({ query: { code: this.state.code } })  //query for id by code
            console.log("CDD")
            console.log(this.state.code)
            console.log("ACCOUNT")
            console.log(account)

            if (account) { //if code query returns non-empty array
                //set redux store
                this.props.setAccount(account)
                //store data to asyncstorage
                const storeResponse = await storeData('accountId', account.id)
                console.log('STore Data repsose')
                console.log(storeResponse)
                if (storeResponse.error) {
                    this.setState({
                        getAccountLoading: false,
                        banner: { show: true, type: 'message', message: "Account found, but login not saved to device. Please login again" }
                        
                    })
                    return
                }
                //success message
                this.setState({
                    getAccountLoading: false,
                    banner: { show: true, type: 'message', message: "Success. Logging in.. " + account.displayName + "..." }
                })

                this.login(account.id)

                //nav to order page                

            } else {
                this.setState({
                    getAccountLoading: false,
                    banner: { show: true, type: 'error', message: "Incorrect code, please try again" }
                })
               
            }
        } catch (error) {
            console.log(error)
            this.setState({
                getAccountLoading: false,
                banner: { show: true, type: 'error', message: "Incorrect code, please try again" }
            })
        }
    }
    login = async (accountId) => {

        //SYNC ACCOUNT ID WITH FIREBASE         
        try {
           // this.setState({ banner: { show: true, type: 'error', message: 'Syncing Store' } })
            syncStore({ accountId: accountId })
        } catch {
            this.setState({
                banner: {
                    show: true,
                    type: 'error',
                    message: 'Trouble logging in. Please close and reopen app'
                }
            })

        }
        //PULL ACCOUNT ID FROM MONGO (SSINGLE SOURCE OF TRUTH FOR ACCOUNT INFO)
        try {
            this.setState({
                getAccountLoading: true,
               // banner: { show: true, type: 'message', message: "Loading account details... " }
            })
            const account = await getAccount({ query: { id: accountId } })
            this.props.setAccount(account)
        } catch {
            this.setState({
                banner: {
                    show: true,
                    type: 'error',
                    message: 'Trouble logging in. Please close and reopen app'
                }
            })
            

            return
        }
        //IF ABLE TO PULL ACCOUNT & SAVE -> NAVIGATE TO ORDER SCREEN
        this.props.navigation.navigate('OrderScreen')
    }

    autoLogin = async () => {
        //check id
        //if true than login with all try catches
        const accountId = await getData('accountId')

        if (!accountId) { //IF NO ACCOUNT FOUND
            this.setState({ //TELL USER TO ENTER IN CODE => GETS SENT TO MANUAL LOGIN
                banner: { show: true, type: 'success', message: 'Device not recongized. Use your unique code to log in' }
            })
        } else {
            await this.login(accountId)
        }

    }
    async componentDidMount() {
        
        this.autoLogin()
    }


    hideBanner = () => {
        this.setState({ banner: { ...this.state.banner, show: false } })
    }

    //     <Button 
    //     title ="Automatic Login"
    //     onPress={this.autoLogin}
    // />

//     <Button 
//     title ="Automatic Login"9450
    render() {
        return (
            <View style={[commonStyles.container, { flex: 1 }]}>
                <Banner banner={this.state.banner} hideBanner={this.hideBanner} />
                <View style={{ paddingLeft: 10 }}>
                    <Text style={{ fontSize: sizes.s25-2, fontFamily: 'bold', color: colors.text }}>Login to SupplyHero</Text>
                </View>
                <View style={{ marginTop: 60, marginBottom: 5 }}>

                    <TextInput 
                    onChangeText={text => this.setState({ code: text })} 
                    placeholder="Enter your unique login code"
                    style={{ backgroundColor: colors.white, padding: 10, borderRadius: 10, fontFamily: 'regular', fontSize: sizes.s15 }}
                   // secureTextEntry 
                    />
                </View>
                <AppButton
                    text="Login"
                    onPress={this.manualLogin}
                />


                {/* <Button
            title="Remove Key"
            onPress={async() => AsyncStorage.removeItem('accountId')}
        /> */}
            </View>
        )
    }

}

const mapStateToProps = state => {
    return (
        {
            account: state.accountState
        }
    )
}

const mapDispatchToProps = dispatch => {
    return { setAccount: account => dispatch(actions.setAccount(account)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

//first time - unique code, sent to email?

    //after that - your accountId persists in storage.

    //let user enter username and password

    //login

    //on success - try the following (if not - throw error message)
        //save good password to app
        //redux set account as loggedin
        //pull relevant accountId - how do I do this? -> it will be stored in Auth provider wtih account        
        //DONE-syncstore with fireabase
        //DONE: pull account details from database & setstate        
        // go to orderScreen

    //if incorrect go show error message

    //how to handle persistent login?

    //let user signup?
import React from 'react'
import { View, Text, Button, TextInput,} from 'react-native';
import Banner from '../../components/Global/Banner'
import { connect } from 'react-redux'
import store from '../../redux/store'
import {getLastAction} from '../../redux/store'
import firebaseApp from '../../firebaseConfig'
import * as actions from '../../redux/actions.js'
import * as data from '../../databaseMock'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccount } from '../../apis/apis'
import _ from 'lodash'
import AppButton from '../../components/Global/AppButton';
import { colors, commonStyles, sizes } from '../../theme';
import { showMessage, hideMessage } from "react-native-flash-message";
import { compress, decompress } from 'compress-json'

let shouldWrite = false;

let justWrote = false;

let lastWriteTime = 0;


const syncStore = ({ accountId }) => {

    //should write needs to instantiate as true on first login or else it won't write to firebase
    //shouldwrite needs to instantiate as false on later logins in order to not to clear the cart

    //so every manual login should assume shouldWrite - or every time device isn't found in store no its based on account object & then ?
    // let shouldWrite = false;
    // if (shouldWrite) {
    //     shouldWrite = true;
    // }

    // console.log('FIREBASE SYNC STORE');
    // console.log(shouldWrite);

    //WRITE CHANGES TO FIREBASE
    try {
    store.subscribe(() => {

        
        console.log('JUST WROTE BEFORE CART WRITE');
        console.log(justWrote);


        let currentWriteTime = new Date()
        currentWriteTime = currentWriteTime.getTime()
        // console.log('CURRENT WRITE TIME');
        // console.log(currentWriteTime);
        // console.log(lastWriteTime);
        // console.log(currentWriteTime - lastWriteTime);

        let lastAction = getLastAction()
        console.log('LAST ACTION');
        console.log(lastAction);

        const storeHold = store.getState()

        if ((lastAction.type.indexOf['BULK_ORDER_UPDATE_DETAILS', 'REMOVE_ORDERED_CART'] !== -1 
            || shouldWrite && currentWriteTime - lastWriteTime > 5000) && storeHold.cartState.masterCart.length > 0) {
        // console.log('writing to firebase')
        // console.log(store.getState())
        // console.log(JSON.parse(JSON.stringify(store.getState())))
        
        // console.log('PRE COMPRESSED STATE IN');
          // console.log(store.getState());
        // console.log('COMPRESSED STATE IN');
        // console.log(JSON.stringify(compress(store.getState())));
            
            console.log('WRITING TO FIREABSE');

            firebaseApp.database().ref('customers/' + accountId).set({
                // state: JSON.parse(JSON.stringify(store.getState()))
                state: JSON.stringify(compress(JSON.parse(JSON.stringify(storeHold)))) //remove undefines and compress
            })

            justWrote = true;

            // console.log('JUST WROTE AFTER CART WRITE');
            // console.log(justWrote);

            lastWriteTime = currentWriteTime

        }
    })

   
    }
    catch (error) {
        // console.log('non-critical firebase error')
    }

    //LISTEN TO FIREBASE FOR STATE CHAGNES

    try {
    firebaseApp.database().ref('customers/' + accountId).on('value', data => {

        //checks if accountid exists, if state exists and if shape of Firebase state is the same as the current state (which comes from Strapi or local)
        //   if (!data.val() || !data.val().state   || !isEqual(keys(data.val().state), keys(store.getState()))) { 

        console.log('JUST WROTe BEFORE CART CHANGE LSITEN');
        console.log(justWrote);

        if(!justWrote) {

            console.log('running update script');

        if (!data.val() || !data.val().state) {
            return { error: 500 };
        }

        // console.log('COMPRESSED STATE OUT');
        // console.log(data.val().state);
        let decompressedState = decompress(JSON.parse(data.val().state))
        // console.log('DECOMPRESSED STATE');
        // console.log(decompressedState);

        shouldWrite = false;
        store.dispatch({
            type: 'SYNC_CART',
            payload: decompressedState
        })
        shouldWrite = true;

    } else {
        justWrote = false;
    }

    console.log('JUST WROTe AFTER CART CHANGE LSITEN');
    console.log(justWrote);
    })
} catch(error) {
    //NON CRITICAL ERROR IF CANT CONNECT TO FIREBASE CART JUST WON'T PERSIST
    // console.log(error)
}

}

let updateCounter = 0;

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
        return { success: 'success' }
    } catch (e) {
        // console.log('store data error')
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


        if (this.state.accountId !== '') {
            this.login(this.state.accountId)
        } else {

        try {
            this.setState({
                getAccountLoading: true,
                banner: { show: true, type: 'message', message: "Verifying your passcode... " }
            })
            const account = await getAccount({ query: { code: this.state.code } })  //query for id by code
            // console.log("CDD")
            // console.log(this.state.code)
            // console.log("ACCOUNT")
            // console.log(account)

            if (account !== 'account not found') { //if code query returns an undefined
                
                //handle if first Login - (set shouldWrite = true)
                shouldWrite = true
                //set redux store

                this.props.setAccount(account)
                //store data to asyncstorage
                const storeResponse = await storeData('accountId', account.id)
                // console.log('STore Data repsose')
                // console.log(storeResponse)
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
                    banner: { show: true, type: 'success', message: "Welcome " + account.displayName + "!" }
                })

                this.login(account.id)

                //nav to order page                

            } else {
                this.setState({
                    getAccountLoading: false,
                    banner: { show: true, type: 'error', message: "Sorry! Looks like your code is invalid. Please try again." }
                })
               
            }
        } catch (error) {
            // console.log(error)
            this.setState({
                getAccountLoading: false,
                banner: { show: true, type: 'error', message: "Sorry! we're having trouble with this request Please try again." }
            })
        }
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
                    message: 'Trouble logging in automatically - please tap login button below. If error persists - please contact support'
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
                    message: 'Trouble logging in automatically - please tap login button below. If error persists - please contact support'
                }
            })           

            return
        }
        //IF ABLE TO PULL ACCOUNT & SAVE -> NAVIGATE TO ORDER SCREEN
        this.props.navigation.navigate('Tabs',{screen:'OrderScreen'})
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
            this.setState({accountId: accountId})
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
            <View style={[commonStyles.container, { flex: 1}]}>
                <Banner banner={this.state.banner} hideBanner={this.hideBanner} />
                <View style={{ paddingTop:100 }}>
                    <Text style={{ fontSize: sizes.s25-2, fontFamily: 'bold', color: colors.text }}>Login to SupplyHero</Text>
                </View>

                <View style={{ marginTop: 60,}}>
                
                    <TextInput 
                    onChangeText={text => this.setState({ code: text })} 
                    placeholder="Enter your unique login code"
                    style={{ backgroundColor: colors.white, paddingHorizontal: 11, borderRadius: 10, fontFamily: 'regular', fontSize: sizes.s14,height:36 }}
                   // secureTextEntry 
                    />                
        
                </View>
                <AppButton
                style={commonStyles.shadow}
                    text="Login"
                    onPress={this.manualLogin}
                />


            {/*   <Button
            title="Remove Key"  
            onPress={async() => AsyncStorage.removeItem('accountId')}
        /> 
            */}
            
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
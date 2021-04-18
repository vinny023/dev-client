import React from 'react'
import { View, Text, Button, TextInput } from 'react-native';
import Banner from '../../components/Global/Banner'
import {connect} from 'react-redux'
import store from '../../redux/store'
import firebaseApp from '../../firebaseConfig'
import * as actions from '../../redux/actions.js'
import * as data from '../../databaseMock'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAccount} from '../../apis/apis'
import _ from 'lodash' 

//WRITE CHANGES TO FIREBASE

const syncStore = ({accountId}) => {
let shouldWrite = true;

store.subscribe(() => {
  if (shouldWrite) {   
    firebaseApp.database().ref('customers/'+accountId).set({
      state: store.getState()
    })
  }
})

//LISTEN TO FIREBASE FOR STATE CHAGNES
firebaseApp.database().ref('customers/'+accountId).on('value', data => {

  //checks if accountid exists, if state exists and if shape of Firebase state is the same as the current state (which comes from Strapi or local)
//   if (!data.val() || !data.val().state   || !isEqual(keys(data.val().state), keys(store.getState()))) { 
if (!data.val() || !data.val().state ) { 
    return {error: 500};
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
    // try {
    //   await AsyncStorage.setItem(key,value)      
    // } catch (e) {
    //   return {error:e}
    // }
  }

const getData = async (key) => {
    // try {
    //   return await AsyncStorage.getItem(key)         
    // } catch(e) {
    //   return {errro:e}
    // }
    return undefined
  }



export class LoginScreen extends React.Component {
    

    constructor(props) {
        super(props)

        this.state = {
            banner: {show: false, type:'', message:''},
            accountId:'',
            code: '',
            getAccountLoading: false
        }
        
    }

    manualLogin = async() => {                
        // ADD QUERY VALIDATION - [TAG]

        try {         
            this.setState({ getAccountLoading: true,
                banner: {...this.state.banner, type:'message', message:"Verifying your unique codee... "}
            })
            const account = await getAccount({query: {code: this.state.code}})  //query for id by code

            if (!_.isEqual(account,{})) { //if code query returns non-empty array
                //set redux store
                this.props.setAccount(account)
                //store data to asyncstorage
                await storeData('accountId',account.id)                   
                //success message
                this.setState({ getAccountLoading: false,
                    banner: {...this.state.banner, type:'message', message:"Success. Logging in... "}
                })          
                this.props.navigation.navigate('OrderScreen')       
                //nav to order page                
                
            } else {
                this.setState({ getAccountLoading: false,
                    banner: {...this.state.banner, type:'error', message:"Incorrect code, please try again"}
                })
            }
            
            
        } catch(error) {
            console.log(error)
            this.setState({ getAccountLoading: false,
                banner: {...this.state.banner, type:'error', message:"Incorrect code, please try again"}
            })
            }
        }

    login = async () => {
        //check id
        //if true than login with all try catches
        const accountId = await getData('accountId')

        if (!accountId) { //IF NO ACCOUNT FOUND
            this.setState({ //TELL USER TO ENTER IN CODE => GETS SENT TO MANUAL LOGIN
                banner: {show: true, type: 'success', message: 'First Time. Use your unique code to log in'}
            })
        } else {
            //SYNC WITH FIREBASE
            this.setState({banner: {...this.state.banner, message: 'First Time. Use your unique code to log in'}})  
            try {
                this.setState({banner: {...this.state.banner, message: 'Syncing Store'}}) 
                syncStore({accountId: accountId})
            } catch {

            }
            //IF ACCOUNT IS STILL EMPTY (OR FIRST TIME LOGIN) - PULL FROM DATABASE
            if (_.isEqual(this.props.account,{})) {    
                this.setState({banner: {...this.state.banner, message: "No account found"}})         
                try {         
                    this.setState({ getAccountLoading: true,
                        banner: {...this.state.banner, type:'message', message:"Loading account details... "}
                    })
                    const account = await getAccount({query: {id: accountId}})                        
                    this.props.setAccount(account[0])
            } catch {
                this.setState({
                    banner: {show: true, 
                            type: 'success', 
                            message: 'Trouble logging in. Please close and reopen app'}
                })
                //2 more times - then show issue with accountId itself?

                return
                }
            }      
            
            //IF ABLE TO PULL ACCOUNT & SAVE -> NAVIGATE TO ORDER SCREEN
            this.props.navigation.navigate('OrderScreen') 
            

        }
        
    }
    async componentDidMount() {

    }


    hideBanner = () => {
        
    }

    render() {
      return (
       <View>
       <Banner banner={this.state.banner} hideBanner={this.hideBanner} />
        <Text>Login Screen</Text>
        <TextInput onSubmitEditing={text => this.setState({code: text})} />
        <Button 
            title ="Manual Login"
            onPress={this.manualLogin}
        />
        
        <Button 
            title ="Automatic Login"
            onPress={this.login}
        />
        <Button
            title="Remove Key"
            onPress={async() => AsyncStorage.removeItem('accountId')}
        />
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
    return {setAccount: account => dispatch(actions.setAccount(account))}   
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
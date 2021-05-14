import React from 'react';
import { StyleSheet, View, Button, Text, TextInput, TouchableOpacity, AppRegistry } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles, sizes } from '../../theme';
import algoliasearch from 'algoliasearch/lite';
import {ALGOLIA_APP_NAME, ALGOLIA_API_KEY} from '../../env.js'
import {setAccount} from '../../apis/apis.js'


//INITIALIZE ALGOLIA FOR SEARCH SUGGESTIONS
const client = algoliasearch(
    ALGOLIA_APP_NAME,
    ALGOLIA_API_KEY
  );

  const index = client.initIndex('dev_Products')



const SearchSuggestion = ({ suggestion, select }) => {
    return (
        <TouchableOpacity style={[styles.container]} onPress={() => select(suggestion)}>
            <Text style={commonStyles.text}>{suggestion}</Text>
            <Ionicons name="ios-search" color={colors.grey.primary} size={sizes.s16} />
        </TouchableOpacity>
    )
}
class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showSuggestions: false,
            searchTerm: '',
            suggestions: this.props.account.searchSuggestions,
            localSuggestions: [],
        }

        this.updateSuggestions = this.updateSuggestions.bind(this)
        this.setSearch = this.setSearch.bind(this)
    }

    updateSuggestions = async (searchTerm) => {
        if (searchTerm.length < 3) {
            this.setState({
                searchTerm: searchTerm,
                suggestions: [...this.state.localSuggestions, ...this.props.account.searchSuggestions],
                showSuggestions: true
            })
           
        }
        else {
            let suggestions = [...this.state.localSuggestions, ...this.props.account.searchSuggestions].filter(suggestion => suggestion.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())).slice(0,5)
            
            try {
                console.log('TRYING ALGOLIA CALL')
                const {hits} = await index.search(searchTerm)
                console.log('HITS')
                console.log(hits)
                const algoliaSuggestions = hits.slice(0,4).map(hit => hit.displayName + ' ('+hit.supplierDisplayName+')')   
                suggestions = [...suggestions.slice(0,2), ...algoliaSuggestions].slice(0,5)
            }

            catch (error) {
                console.log('ALGOLIA SUSGGESTION ERROR');
                console.log(error)
            }             

            this.setState({
                searchTerm: searchTerm,
                suggestions: suggestions,
                showSuggestions: true
            })

        }
    }
    setSearch = async(term) => {

        let newLocSuggestions = [...this.state.localSuggestions]
        const returnval = this.props.setSearch(term)
        //save to search suggestions if new suggestion
        if (this.props.account.searchSuggestions.indexOf(term) === -1 && this.state.localSuggestions.indexOf(term) === -1) {
            try {
                console.log('SAVING DOWN ')
                console.log(this.props.account)
                newLocSuggestions = [term, ...this.state.localSuggestions]
                setAccount({id: this.props.account.id, update:{searchSuggestions: [term, ...this.state.localSuggestions, ...this.props.account.searchSuggestions]}})
                .then(response => console.log('SET ACCOUNT RESPONSe'-response))
            } catch {
                console.log('ERROR DID NOT SAVE SUEARCH SUGGESTION')
            }

        }

        this.setState({
            searchTerm: term,
            showSuggestions: false,           
            localSuggestions: newLocSuggestions             
        })

        return returnval
        
    }

    clearSearch() {
        this.setState({
            searchTerm: '',
            showSuggestions: false,
            suggestions: [...this.state.localSuggestions, ...this.props.account.searchSuggestions]
        })
        return this.props.setSearch('')  
        
            
    }

setSuggestion=()=>{
   
    this.setState({ showSuggestions: true })
    return this.props.setSuggestion(true)
}

componentDidUpdate(prevProps, prevState) {
        // //create Filter from Filter Input if it changes
        // if (!_.isEqual(this.props.filter, prevProps.filter)) {
        //     console.log('RESET FILTER - FOR SEARCH SUGGESTIONS');
    
        // const algoliaFilter = this.props.filter((filter) => algoliaFilterFields.indexOf(filter.field) !== -1)
        //     .reduce((algoliaFilter, filter) => algoliaFilter + "("+filter.values
        //         .reduce((filterString, filterValue) => filterString + filter.field+filter.comparison + `"`+filterValue+`"` +" OR ", "").slice(0,-4)+") AND ","").slice(0,-4)
        // }

}


    render() {
        return (
            <View>
                <View style={[styles.container, { marginTop: 15, borderRadius: 10, paddingRight: 15,borderColor:this.state.showSuggestions?colors.blue.primary:colors.white,borderWidth:1, }]}>
                    <TextInput
                        placeholder="Search Items"
                        value={this.state.searchTerm}
                        style={{ fontFamily: 'regular', width: '85%',fontSize:sizes.s14 }}
                        onChangeText={text => this.updateSuggestions(text)}
                        onSubmitEditing={event => this.setSearch(event.nativeEvent.text)}
                        onFocus={this.setSuggestion}
                    />
                    {this.state.showSuggestions || this.state.searchTerm ?
                        <TouchableOpacity onPress={() => this.clearSearch()} style={{width:'15%',alignItems:'flex-end'}}>
                            <Ionicons name="ios-close" color={colors.text} size={sizes.s20} />
                        </TouchableOpacity>
                        :
                        <Ionicons name="ios-search" color={colors.grey.primary} size={sizes.s16} />
                    }
                </View>
                {this.state.showSuggestions &&
                    <View>
                        <View style={{ padding: 10, borderRadius: 10, backgroundColor: colors.white, marginTop: 30, }}>
                            {this.state.suggestions.slice(0,5).map((suggestion, i) => <SearchSuggestion key={i} suggestion={suggestion} select={this.setSearch} />)}
                        </View>
                    </View>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        
        backgroundColor: colors.white,
        paddingHorizontal: 11,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 36

    },
})
export default Search


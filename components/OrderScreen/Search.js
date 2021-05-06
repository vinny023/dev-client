import React from 'react';
import { StyleSheet, View, Button, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles, sizes } from '../../theme';

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
            suggestions: this.props.account.searchSuggestions
        }

        this.updateSuggestions = this.updateSuggestions.bind(this)
        this.setSearch = this.setSearch.bind(this)
    }

    updateSuggestions(searchTerm) {
        if (searchTerm.length < 3) {
            this.setState({
                searchTerm: searchTerm,
                suggestions: this.props.account.searchSuggestions,
                showSuggestions: true
            })
           
        }
        else {
            this.setState({
                searchTerm: searchTerm,
                suggestions: [searchTerm, searchTerm + 'ing', searchTerm + 'inus', searchTerm + ' breast'],
                showSuggestions: true
            })
        }
    }
    setSearch(term) {
        this.setState({
            searchTerm: term,
            showSuggestions: false
        })
        return this.props.setSearch(term)
        
    }

    clearSearch() {
        this.setState({
            searchTerm: '',
            showSuggestions: false,
            suggestions: this.props.account.searchSuggestions
        })
        return this.props.setSearch('')  
        
            
    }
setSuggestion=()=>{
   
    this.setState({ showSuggestions: true })
    return this.props.setSuggestion(true)
}
    render() {
        return (
            <View>
                <View style={[styles.container, { marginTop: 15, borderRadius: 10, paddingRight: 15, }]}>
                    <TextInput
                        placeholder="Search Items"
                        value={this.state.searchTerm}
                        style={{ fontFamily: 'regular', width: '85%' }}
                        onChangeText={text => this.updateSuggestions(text)}
                        onSubmitEditing={event => this.setSearch(event.nativeEvent.text)}
                        onFocus={this.setSuggestion}
                    />
                    {this.state.showSuggestions ?
                        <TouchableOpacity onPress={() => this.clearSearch()} style={{width:'15%',padding:10,alignItems:'center'}}>
                            <Ionicons name="ios-close" color={colors.text} size={sizes.s20} />
                        </TouchableOpacity>
                        :
                        <Ionicons name="ios-search" color={colors.grey.primary} size={sizes.s16} />
                    }
                </View>
                {this.state.showSuggestions &&
                    <View>
                        <View style={{ padding: 10, borderRadius: 10, backgroundColor: colors.white, marginTop: 30, }}>
                            {this.state.suggestions.map((suggestion, i) => <SearchSuggestion key={i} suggestion={suggestion} select={this.setSearch} />)}
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
        height: 50

    },
})
export default Search


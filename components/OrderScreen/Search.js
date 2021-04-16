import React from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';

const SearchSuggestion = ({suggestion, select}) => {
    return (
        <Button 
            title={suggestion}
            onPress={() => select(suggestion)}
        />
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
                suggestions: [searchTerm, searchTerm+'ing', searchTerm+'inus', searchTerm+' breast'],
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

    render() {
        return (
            <View>
            <TextInput 
                placeholder="Search Items" 
                value={this.state.searchTerm} 
                onChangeText={text => this.updateSuggestions(text)}
                onSubmitEditing={text => this.setSearch(text)}   
                onFocus={() => this.setState({showSuggestions: true})} 
            />
            <Button title="X" onPress={() => this.clearSearch()}/>
           
            {this.state.showSuggestions && 
                this.state.suggestions.map((suggestion, i) => <SearchSuggestion key={i} suggestion={suggestion} select={this.setSearch}/>)
            }
            </View>
        )
    }
}

export default Search


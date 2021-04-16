import React from 'react'
import {connect} from 'react-redux'
import {Text, View, Button} from 'react-native'
import { fetchAction } from '../redux/actions'



export class FetchLoader extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {  
        const {data, loading, error} = this.props.fetchState
        
        return (
            <View>
            { loading ? <Text>Click Button To Load</Text> : <Text>Loading</Text> }
            { (data !== null) && <Text>{data.rates.aed.name}</Text>}
            <Button
                title="Click Me to Fetch"
                onPress={() => this.props.fetch()}
            />
            </View>

        )
    }
}

const mapDispatchToProps = dispatch => {
    return ({
        fetch: () => dispatch(fetchAction())
    })
}

const mapStateToProps = state => {
    return({
        fetchState: state.fetchState
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(FetchLoader)
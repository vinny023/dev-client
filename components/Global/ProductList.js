import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux'
import {FlatList, View, ScrollView} from 'react-native';
import ProductListItem from './ProductListItem'

const NUM_SHOW_ITEMS = 10

export default class ProductList extends React.Component {
    
constructor(props) {
    super(props)
    this.state = {
        productList: this.props.productList,
        shownList: this.props.productList.slice(0,9),
        index: 9
    }
}

loadNext = () => {
    this.setState({
        index: this.state.index + NUM_SHOW_ITEMS,
        shownList: this.state.productList.slice(0, this.state.index + 2*NUM_SHOW_ITEMS-1)
    })
}

loadPrev = () => {

}

render() {

    // console.log('PRODUCT LIST RENDERING')
    // console.log(this.props.productList)

    if (this.props.listType && this.props.listType === 'noFlatList') {
        
        return (
            <ScrollView showsVerticalScrollIndicator={false}>        
                {this.props.productList.map((product, index) => {
                    return (<ProductListItem 
                        hideZero={true} item={product} key={index} navigation={this.props.navigation} reorderOnly={this.props.reorderOnly}/>
                    )
                }
                        
                        )
                    
                    }
            </ScrollView>           
        )
        
    } else {

        return (
        
            <FlatList
                data={this.state.shownList}
                initialNumToRender = {NUM_SHOW_ITEMS}
                removeClippedSubviews={true}
                onEndReached={this.loadNext}
                onEndReachedThreshold={0.5}           
                renderItem={({item}) => <ProductListItem item={item}/>}
            />              
        )

    }
  
        
        

    
    
}

}

// const mapStateToProps = state => ( {
//     masterCart: state.cartState.masterCart
//   })

// export default connect(mapStateToProps)(ProductList)


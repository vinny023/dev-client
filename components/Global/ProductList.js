import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux'
import {FlatList, View, ScrollView} from 'react-native';
import ProductListItem from './ProductListItem'
import { commonStyles } from '../../theme';



const NUM_SHOW_ITEMS = 10

export default class ProductList extends React.Component {
    
constructor(props) {
    super(props)
    this.state = {
        productList: this.props.productList,
        shownList: this.props.productList.slice(0,10),
        index: 9
    }
}

loadNext = () => {
    // console.log('FIRING LOAD NEXT');
    this.setState({
        index: this.state.index + NUM_SHOW_ITEMS,
        shownList: this.state.productList.slice(0, Math.min(this.state.productList.length,this.state.index + 2*NUM_SHOW_ITEMS))
    })

}

loadPrev = () => {

}

componentDidUpdate(prevProps) {


}

shouldComponentUpdate(prevProps, prevState) {

    return (!_.isEqual(prevProps.productList,this.props.productList) || !_.isEqual(prevState.shownList, this.state.shownList))

}

render() {

    // console.log('PRODUCT LSIT RENDER');
    // console.log(this.props.productList);
   // console.log( this.state.productList);
   // console.log(this.state.shownList);


    if (this.props.listType && this.props.listType === 'noFlatList') {
        
        return (
            <ScrollView showsVerticalScrollIndicator={false}>        
                {this.props.productList.map((product, index) => {
                    return (<ProductListItem 
                        hideZero={true} item={product} key={index} navigation={this.props.navigation} reorderOnly={this.props.reorderOnly}  reorderNotification={this.props.reorderNotification}/>
                    )
                }
                        
                        )
                    
                    }
            </ScrollView>           
        )
        
    } else {

        let paddingBottom = 0
        if (this.props.paddingBottom) {
            paddingBottom = this.props.paddingBottom
        }

        return (
        
            <FlatList
                data={this.state.shownList}
                initialNumToRender = {NUM_SHOW_ITEMS}
                removeClippedSubviews={true}
                onEndReached={this.loadNext}
                onEndReachedThreshold={0.5}  
                style={commonStyles.card}         
                renderItem={({item}) => <ProductListItem item={item} reorderOnly={this.props.reorderOnly}  reorderNotification={this.props.reorderNotification}/>}
                extraData={this.state}
                contentContainerStyle={{ paddingBottom: paddingBottom }}
            />              
        )

    }
  
        
        

    
    
}

}

// const mapStateToProps = state => ( {
//     masterCart: state.cartState.masterCart
//   })

// export default connect(mapStateToProps)(ProductList)


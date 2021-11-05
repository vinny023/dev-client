import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles, sizes } from '../../theme';
import _ from 'lodash';
import { connect } from 'react-redux'


class DeliverySelector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orderTotal: 0,
            deliveryFee: 0.
        }
    }

    componentDidUpdate(prevProps, prevState) {

        // console.log('COMPONENT UPDATE RUNNING');

       //IF CART CHANGED OR SUPPLIER DETAIL SI FIRST CALLED, RECALC TOTALS

        const lastCart = prevProps.masterCart[this.props.index]
        const thisCart = this.props.masterCart[this.props.index]

        // console.log('CART STATE');

        if ((!_.isEqual(lastCart, thisCart) && !!this.props.supplierDetail) || !_.isEqual(this.props.supplierDetail, prevProps.supplierDetail)) {
            
            console.log('UPDATING Delivery SEtting ');  

            //**ADD STUFF HEERE */


            this.setState({
                // **ADD STUFF HERE
            })
        }
    }

    shouldComponentUpdate(nextProps, prevState) {

        const nextCart = nextProps.masterCart[this.props.index]
        const thisCart = this.props.masterCart[this.props.index]

        // console.log('CHECKING IF SHOULD UPDATE');
        // console.log(nextCart);
        // console.log(thisCart);
        // console.log((!_.isEqual(nextCart, thisCart) && !!this.props.supplierDetail) || !_.isEqual(this.props.supplierDetail, nextProps.supplierDetail));

        return (!_.isEqual(nextCart, thisCart) && !!this.props.supplierDetail) || !_.isEqual(this.props.supplierDetail, nextProps.supplierDetail)
    }
 
    render() {

        // console.log('RENDING ORDER TOTAL ');
        // console.log(this.state.orderTotal);
        // console.log(this.props.suppierDetail);
        // console.log(this.props.masterCart[this.props.index]);
        return (
            <View>

            {this.state.orderTotal > 0 ?

                <View style={[commonStyles.card]} >
        
                                        <View>
                                            <View style={[styles.row]}>
                                                <Text style={styles.heading}>Minimum </Text>
                                                <Text style={styles.boldText}>${this.props.supplierDetail.orderMinimum.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                            </View>
                                            <View style={styles.row}>
                                                <Text style={styles.heading}>Subtotal</Text>
                                                <Text style={styles.boldText}>${this.state.orderTotal - this.state.deliveryFee.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                            </View>
                                            <View style={styles.row}>
                                                <Text style={styles.heading}>Delivery fee</Text>
                                                <Text style={styles.boldText}>${this.state.deliveryFee.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                            </View>
                                            <View style={styles.row}>
                                                <Text style={styles.heading}>Total</Text>
                                                <Text style={styles.boldText}>${this.state.orderTotal.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                            </View>
                                        </View>
                            </View> 
                                :
                                        <></>
                        }

                </View>


            

        )}
}


const mapStateToProps = state => {
    return (
        {
            masterCart: state.cartState.masterCart,
            account: state.accountState.account
        }
    )
}

export default connect(mapStateToProps)(OrderTotal)

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 10
        //paddingVertical: 10
    },
    // lightText: {
    //     //fontSize: sizes.s17,
    //     fontSize: sizes.s16,
    //     fontFamily: 'medium',
    //     color: colors.grey.primary
    // },
    boldText: {
        fontFamily: 'medium',
        fontSize: sizes.s17,
        // fontSize: sizes.s19,
        color: colors.text
    },
    heading: {
        //paddingTop: 10,
        //fontSize: sizes.s17,
        fontSize: sizes.s15,
        fontFamily: 'regular',
        color: colors.grey.primary
    },
    container: {
        backgroundColor: colors.white,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginVertical: 5
    },
    text: {
        fontFamily: 'medium',
        // fontSize: sizes.s17,
        fontSize: sizes.s15,
        color: colors.grey.primary
    },
    input: {
        padding: 10,
        lineHeight: 23,
        flex: 2,
        textAlignVertical: 'top',
        // backgroundColor: 'white',
        // borderRadius: 10
    },
   
})


import { Ionicons } from '@expo/vector-icons';
import _, { floor, round } from 'lodash';
import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { View, Button, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Dimensions, } from 'react-native';
import { RadioButton } from 'react-native-paper'
import { colors, commonStyles, sizes } from '../../theme';
import AppButton from '../Global/AppButton';
//import { Modal } from '@ui-kitten/components';
import Modal from 'react-native-modal'
// import {RangeSlider} from 'rn-range-slider';
//import Thumb from '../Slider/Thumb';
//import CustomSlider from '../Slider/CustomSlider';

const dimensions = Dimensions.get('window')
const sortOptions = [
    { 'title': 'Price Low To High', 'value': { 'price': 1 } },
    { 'title': 'Price High To Low', 'value': { 'price': -1 } },
    { 'title': 'Recently Ordered', 'value': { 'orderHistory': 1 } },
    { 'title': 'Size Low To High', 'value': { 'size': 1 } },
    { 'title': 'Size High To Low', 'value': { 'size': -1 } },
    { 'title': 'Qty Low To High', 'value': { 'qtyPerItem': 1 } },
    { 'title': 'Qty High To Low', 'value': { 'qtyPerItem': -1 } }
]

const filterOptions = [
    { 'title': 'Supplier', 'field': 'supplierDisplayName', 'options': [] },
    { 'title': 'Units', 'field': 'units', 'options': [] },
    { 'title': 'Price', 'field': 'price', 'min': 9999, 'max': -9999 },
    { 'title': 'Size', 'field': 'size', 'min': 9999, 'max': -9999 },
    { 'title': 'Qty', 'field': 'qtyPerItem', 'min': 9999, 'max': -9999 }
]
const getFilters = (productList) => {
    // console.log('IN FUCNTION PLIST')
    // console.log(productList)

    productList.forEach(product => {
        const { supplierDisplayName, supplierId, units, price, size, qtyPerItem } = product
        const propertyArray = [supplierDisplayName, units, price, size, qtyPerItem]

        filterOptions.forEach((filterOption, index) => {
            if (filterOption.title === 'Supplier' || filterOption.title === 'Units') {
                if (filterOptions[index].options.filter(option => propertyArray[index] === option).length === 0) {
                    filterOptions[index].options.push(propertyArray[index])
                }
            } else {
                let newVal = propertyArray[index]
                if (newVal > filterOptions[index].max) { filterOptions[index].max = newVal }
                if (newVal < filterOptions[index].min) { filterOptions[index].min = newVal }
            }
        })
        return filterOptions

    })
    return filterOptions
}

export default class FilterModal extends React.Component {

    state = { low: 0, high: 100 }

    renderThumb = () => <View style={styles.thumb} />;
    renderRail = () => <View style={styles.rail} />
    renderRailSelected = () => <View style={styles.railSelected} />
    handleValueChangePrice = (newLow, newHigh, fromUser) => {
        if (fromUser) {
            // if (title === 'Price') 
            let gt = "$gt"
            let lt = "$lt"

            let field = filterOptions[2].field;
            if (this.state.lowPrice !== newLow) {
                this.props.setFilter({ 'field': field, 'comparison': lt, 'values': [newLow] })
                this.setState({ lowPrice: newLow })
            } else {
                this.props.setFilter({ 'field': field, 'comparison': gt, 'values': [newHigh] })
                this.setState({ highPrice: newHigh })
            }
            this.setState({ lowPrice: newLow })
        }

    }
    handleValueChangeSize = (newLow, newHigh, fromUser) => {
        if (fromUser) {
            console.log('I AM SIZE')

            let gt = '>'
            let lt = '<'
            //  this.setState({ high: newHigh })
            let field = filterOptions[3].field;
            if (this.state.lowSize !== newLow) {
                this.props.setFilter({ 'field': field, 'comparison': lt, 'values': [newLow] })
                this.setState({ lowSize: newLow })
            } else if (this.state.highSize !== newHigh) {
                this.props.setFilter({ 'field': field, 'comparison': gt, 'values': [newHigh] })
                this.setState({ highSize: newHigh })
            }

        }

    }
    handleValueChangeQty = (newLow, newHigh, fromUser) => {
        if (fromUser) {
            let gt = '>'
            let lt = '<'

            let field = filterOptions[4].field;
            if (this.state.lowQty !== newLow) {
                this.props.setFilter({ 'field': field, 'comparison': lt, 'values': [newLow] })
                this.setState({ lowQty: newLow })
            } else if (this.state.highQty !== newHigh) {
                this.props.setFilter({ 'field': field, 'comparison': gt, 'values': [newHigh] })
                this.setState({ highQty: newHigh })
            }

        }
    }
    renderLabel = (val) => (
        <View>
            <Text>{val}</Text>
        </View>
    )
    sizeHandler = (filterValue) => {
        this.props.setFilter(filterValue)
        this.setState({ isUnitSelected: true })
    }

    constructor(props) {
        super(props)
        // this.getFilters = this.getFilters.bind(this)
        this.state = {
            visible: true,
            isUnitSelected: false,
            lowPrice: 0,
            highPrice: 0,
            lowSize: 0,
            highSize: 0,
            lowQty: 0,
            highQty: 0,
            field: ''
        }
    }

    render() {
        // console.log('PROPS')
        // console.log(this.props.productList)

        const filterOptions = getFilters(this.props.productList)


        return (

            <Modal
                animationType="slide"
                transparent={true}
                isVisible={true}
                backdropOpacity={.5}
                coverScreen={true}
                style={commonStyles.modalView}
            >
                <View style={commonStyles.centeredView} >
                    <ScrollView contentContainerStyle={{ padding: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ alignSelf: 'flex-start', paddingBottom: 15 }} onPress={() => this.props.close(false)}>
                                <Ionicons name='close' size={sizes.s20} />
                            </TouchableOpacity>
                            <Text style={[commonStyles.lightText, { color: colors.blue.primary }]}>Reset</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={{ fontSize: sizes.s20 + 2, fontFamily: 'bold', color: colors.text, }}>Filter and Sort</Text>
                        </TouchableOpacity>

                        <Text style={styles.heading}>Sort By</Text>
                        <View style={{ marginLeft: 7 }} >
                            <ScrollView horizontal>

                                {sortOptions.map((option, i) => {

                                    let selected = (this.props.sort.filter(currOptionVal => _.isEqual(currOptionVal, option.value)).length > 0)
                                    console.log(selected)
                                    let { value, title } = option
                                    if (selected) {
                                        value = { ...option.value, 'remove': true }
                                        title = option.title + ' (Selected)'
                                    }
                                    return (

                                        <View key={i} style={{ marginRight: 10 }} >
                                            {/* <RadioButton
                                            value={title}
                                            label={title}
                                            uncheckedColor={'#E6F0FD'}
                                            color={colors.blue.primary}
                                            status={title.includes("Selected") ? 'checked' : 'unchecked'}
                                            onPress={() => this.props.setSort(value)}
                                            />
                                            <View style={{ marginLeft: 7 }}>
                                            <Text style={commonStyles.text}>{title.replace('(Selected)', '')}</Text>
                                        </View> */}

                                            <AppButton
                                                onPress={() => this.props.setSort(value)}
                                                text={title.replace('(Selected)', '')}
                                                style={{ backgroundColor: title.includes("Selected") ? colors.blue.primary : colors.background.dark, elevation: 0, paddingHorizontal: 10 }}
                                                textStyle={title.includes("Selected") ? styles.selectedText : styles.unselectedText} />

                                        </View>


                                    )
                                })}
                            </ScrollView>
                        </View>
                        {/* <Text>Filter</Text> */}
                        {filterOptions.map((filterOption, i) => {
                            const { title, field, options, min, max } = filterOption
                            if (title === 'Units') {
                                //SELECTION FILTER
                                return (
                                    <View key={i}>
                                        {options.length > 0 && <Text style={styles.heading}>{title}</Text>}
                                        <View style={{ marginLeft: 7 }}>
                                            <ScrollView horizontal>
                                                {
                                                    options.map((option, k) => {
                                                        let selected = (this.props.filter
                                                            .filter(currOptionVal => currOptionVal.field === field && currOptionVal.values.indexOf(option) !== -1).length > 0)

                                                        //CHECK IF SELECTED
                                                        let filterValue = { 'field': field, 'comparison': ':', 'value': option }
                                                        let label = option;
                                                        if (selected) {
                                                          
                                                            label = label + '(Selected)'
                                                            filterValue = { ...filterValue, 'remove': true }
                                                           
                                                        }
                                                        return (
                                                            <View key={k} style={{ marginRight: 10 }}>
                                                                {/* <RadioButton
                                                                            value={label}
                                                                            label={label}
                                                                            uncheckedColor={'#E6F0FD'}
                                                                            color={colors.blue.primary}
                                                                    status={label.includes("Selected") ? 'checked' : 'unchecked'}
                                                                    onPress={() => this.props.setFilter(filterValue)}
                                                                    />
                                                                <View style={{ marginLeft: 7 }}>
                                                                <Text style={commonStyles.text}>{label.replace('(Selected)', '')}</Text>
                                                                </View> */}

                                                                <AppButton
                                                                    onPress={() => this.sizeHandler(filterValue)}
                                                                    text={label.replace('(Selected)', '')}
                                                                    style={{ backgroundColor: label.includes("Selected") ? colors.blue.primary : colors.background.dark, elevation: 0, paddingHorizontal: 15 }}
                                                                    textStyle={label.includes("Selected") ? styles.selectedText : styles.unselectedText} />
                                                            </View>

                                                        )
                                                    })
                                                }
                                            </ScrollView>
                                        </View>
                                    </View>
                                )
                            }
                            if (title === 'Supplier') {
                                //SELECTION FILTER
                                return (
                                    <View key={i}>
                                        {options.length > 0 && <Text style={styles.heading}>{title}</Text>}
                                        <View style={styles.container}>
                                            {
                                                options.map((option, k) => {
                                                    let selected = (this.props.filter
                                                        .filter(currOptionVal => currOptionVal.field === field && currOptionVal.values.indexOf(option) !== -1).length > 0)

                                                    //CHECK IF SELECTED
                                                    let filterValue = { 'field': field, 'comparison': ':', 'value': option }
                                                    let label = option;
                                                    if (selected) {
                                                        label = label + '(Selected)'
                                                        filterValue = { ...filterValue, 'remove': true }
                                                    }
                                                    return (
                                                        <View key={k} style={commonStyles.row}>
                                                            <RadioButton

                                                                value={label}
                                                                label={label}
                                                                uncheckedColor={'#E6F0FD'}
                                                                color={colors.blue.primary}
                                                                status={label.includes("Selected") ? 'checked' : 'unchecked'}
                                                                onPress={() => this.props.setFilter(filterValue)}
                                                            />
                                                            <View style={{ marginLeft: 7 }}>
                                                                <Text style={commonStyles.text}>{label.replace('(Selected)', '')}</Text>
                                                            </View>
                                                        </View>

                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                )
                            }

                            else {
                                //NUMBER RANGE FILTER                      
                                let minValue = ''
                                let maxValue = ''

                                //set comparison to $gt & $lt for mongo price
                                let gt = '>'
                                let lt = '<'

                                if (title === 'Price') {
                                    gt = "$gt"
                                    lt = "$lt"
                                }

                                //CHECK IF SELECTED
                                this.props.filter.filter(currFilter => currFilter.field === field).forEach(currFilter => {
                                    if (currFilter.comparison === gt) {
                                        minValue = currFilter.values[0].toString()
                                    } else if (currFilter.comparison === lt) {
                                        maxValue = currFilter.values[0].toString()
                                    }
                                })
                                return (
                                    <View >
                                        <Text style={styles.heading}>Filter by {title}</Text>
                                        <View style={[styles.container]}>
                                            {/* <Text style={styles.text}>Min ({min}):
                                             <TextInput
                                                    style={{ color: colors.blue.primary }}
                                                    keyboardType='number-pad'
                                                    onSubmitEditing={text => this.props.setFilter({ 'field': field, 'comparison': gt, 'values': [parseFloat(text.nativeEvent.text)] })}
                                                    defaultValue={minValue}
                                                />
                                                <Button title="X" onPress={() => this.props.setFilter({ 'field': field, 'comparison': gt, 'remove': true })} />
                                            </Text> 
                                             <Text style={styles.text}>Max ({max}):
                                            <TextInput
                                                    keyboardType='number-pad'
                                                    placeholder={maxValue}
                                                    onSubmitEditing={text => this.props.setFilter({ 'field': field, 'comparison': lt, 'values': [parseFloat(text.nativeEvent.text)] })}
                                                    defaultValue={maxValue}
                                                />
                                                <Button title="X" onPress={() => this.props.setFilter({ 'field': field, 'comparison': lt, 'remove': true })} />
                                               </Text> */}
                                            <View >
                                                {/* <Text style={styles.text}>Min </Text> */}
                                                {(title == "Price") &&
                                                    <View>
                                                        <View style={[commonStyles.row, { justifyContent: "center" }]}>
                                                            <Text style={[commonStyles.text, { fontSize: sizes.s18 }]}>${round(min, 0)} -</Text>

                                                            <Text style={[commonStyles.text, { fontSize: sizes.s18 }]}> ${round(max, 0)}</Text>
                                                        </View>
                                             
                                                        <View style={[commonStyles.row, { justifyContent: "space-between" }]}>
                                                            <Text style={[commonStyles.lightText, { color: '#C9CDD1' }]}>${round(min, 0)}</Text>
                                                            <Text style={[commonStyles.lightText, { color: '#C9CDD1' }]}>${round(max, 0)}</Text>
                                                        </View>
                                                        {/* <TextInput
                                                            style={styles.input}
                                                            keyboardType='number-pad'
                                                            placeholder={`$ ${round(min, 0)}`}
                                                            maxLength={5}
                                                            placeholderTextColor={colors.blue.primary}
                                                            onSubmitEditing={text => this.props.setFilter({ 'field': field, 'comparison': gt, 'values': [parseFloat(text.nativeEvent.text)] })} /> */}
                                                    </View>
                                                }
                                                {title == "Size" &&
                                                    <View>
                                                        {this.state.isUnitSelected ?
                                                            //Size
                                                            <View >
                                                                <View style={[commonStyles.row, { justifyContent: "center" }]}>
                                                                    <Text style={[commonStyles.text, { fontSize: sizes.s18 }]}>${round(min, 0)} -</Text>
                                                                    <Text style={[commonStyles.text, { fontSize: sizes.s18 }]}> ${round(max, 0)}</Text>
                                                                </View>
                                                               
                                                                <View style={[commonStyles.row, { justifyContent: "space-between" }]}>
                                                                    <Text style={[commonStyles.lightText, { color: '#C9CDD1' }]}>${round(min, 0)}</Text>
                                                                    <Text style={[commonStyles.lightText, { color: '#C9CDD1' }]}>${round(max, 0)}</Text>
                                                                </View>
                                                            </View>
                                                            :
                                                            <Text style={[commonStyles.lightText,{textAlign:'center'}]}>Please Select Unit first</Text>
                                                        }
                                                    </View>
                                                    // <TextInput
                                                    //     style={styles.input}
                                                    //     keyboardType='number-pad'
                                                    //     placeholder={`${min}`}
                                                    //     maxLength={5}

                                                    //     placeholderTextColor={colors.blue.primary}
                                                    //     onSubmitEditing={text => this.props.setFilter({ 'field': field, 'comparison': gt, 'values': [parseFloat(text.nativeEvent.text)] })} />
                                                }
                                                {/* <Text style={styles.text}>Max</Text> */}
                                                {!!(title == "Price") &&
                                                    // <TextInput
                                                    //     keyboardType='number-pad'
                                                    //     placeholder={`$ ${round(max, 0)}`}
                                                    //     placeholderTextColor={colors.blue.primary}
                                                    //     style={styles.input}
                                                    //     maxLength={5}
                                                    //     onSubmitEditing={text => this.props.setFilter({ 'field': field, 'comparison': lt, 'values': [parseFloat(text.nativeEvent.text)] })}
                                                    // />
                                                    <View />

                                                    //same as price

                                                }
                                                {title == "Qty" &&
                                                    // <TextInput
                                                    //     keyboardType='number-pad'
                                                    //     placeholder={`${round(max, 0)}`}
                                                    //     maxLength={5}
                                                    //     placeholderTextColor={colors.blue.primary}
                                                    //     style={styles.input}
                                                    //     onSubmitEditing={text => this.props.setFilter({ 'field': field, 'comparison': lt, 'values': [parseFloat(text.nativeEvent.text)] })}
                                                    // />
                                                    <View>
                                                        <View style={[commonStyles.row, { justifyContent: "center" }]}>
                                                            <Text style={[commonStyles.text, { fontSize: sizes.s18 }]}>${round(min, 0)} -</Text>

                                                            <Text style={[commonStyles.text, { fontSize: sizes.s18 }]}> ${round(max, 0)}</Text>
                                                        </View>
                                                 
                                                        <View style={[commonStyles.row, { justifyContent: "space-between" }]}>
                                                            <Text style={[commonStyles.lightText, { color: '#C9CDD1' }]}>${round(min, 0)}</Text>
                                                            <Text style={[commonStyles.lightText, { color: '#C9CDD1' }]}>${round(max, 0)}</Text>
                                                        </View>
                                                    </View>
                                                }
                                            </View>

                                        </View>
                                    </View>
                                )
                            }
                        })}

                    </ScrollView>

                    <AppButton text={"APPLY"} style={{ marginHorizontal: 10 }} onPress={() => this.props.close(false)} />

                </View>
            </Modal>
        )
    }

}
const THUMB_RADIUS = 9;
const styles = StyleSheet.create({


    container: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 10,
        marginTop: 10
    },
    heading: {
        paddingTop: 10,
        fontSize: sizes.s17,
        fontFamily: 'medium',
        color: colors.grey.primary,
    },

    input: {
        backgroundColor: colors.blue.light,
        marginHorizontal: 20,
        paddingHorizontal: 20,
        padding: 5,
        borderRadius: 10,
        color: colors.blue.primary,
        // maxWidth:95
    },
    unselectedText: {
        color: colors.grey.dark,
        fontSize: sizes.s15,
        fontFamily: "medium"
    },
    selectedText: {
        fontFamily: 'medium',
        fontSize: sizes.s15
    },
    slider: {
        flex: 3,
        //  justifyContent: 'center',
        paddingHorizontal: 40,
        width: '100%',
    },
    thumb: {
        width: THUMB_RADIUS * 2,
        height: THUMB_RADIUS * 2,
        borderRadius: THUMB_RADIUS,
        // borderWidth: 2,
        //  borderColor: '#7f7f7f',
        backgroundColor: colors.blue.primary,
    },
    rail: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E8EBEF',
    },
    railSelected: {
        height: 4,
        backgroundColor: colors.blue.primary,
        borderRadius: 2,
    },
})
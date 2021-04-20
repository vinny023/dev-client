import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash';
import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { View, Button, Text, TextInput, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper'
import { colors, sizes } from '../../theme';
import AppButton from '../AppButton';

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
    { 'title': 'Price', 'field': 'price', 'min': 999999, 'max': -999999 },
    { 'title': 'Size', 'field': 'size', 'min': 999999, 'max': -999999 },
    { 'title': 'Qty', 'field': 'qtyPerItem', 'min': 999999, 'max': -999999 }
]

const getFilters = (productList) => {
    console.log('IN FUCNTION PLIST')
    console.log(productList)

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

    constructor(props) {
        super(props)
        // this.getFilters = this.getFilters.bind(this)
    }

    render() {
        console.log('PROPS')
        console.log(this.props.productList)

        const filterOptions = getFilters(this.props.productList)
        console.log(filterOptions)

        return (

            <Modal
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalView}>
                    <ScrollView contentContainerStyle={{ padding: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ paddingLeft: 15, flex: 0.5 }} onPress={() => this.props.close(false)}>
                                <Ionicons name="arrow-back" color={colors.text} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: sizes.s20, fontFamily: 'regular', color: colors.text, flex: 1 }}>Filter & Sort</Text>
                        </View>

                        {/* <Text>Filter</Text> */}
                        {filterOptions.map((filterOption, i) => {
                            const { title, field, options, min, max } = filterOption
                            if (title === 'Supplier' || title === 'Units') {
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
                                                        <View key={k} style={styles.row}>
                                                            <RadioButton

                                                                value={label}
                                                                label={label}
                                                                uncheckedColor={'#E6F0FD'}
                                                                color={colors.blue.primary}
                                                                status={label.includes("Selected") ? 'checked' : 'unchecked'}
                                                                onPress={() => this.props.setFilter(filterValue)}
                                                            />
                                                            <Text style={styles.text}>{label.replace('(Selected)', '')}</Text>
                                                        </View>

                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                )
                            } else {
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
                                        <Text style={styles.heading}>{title}</Text>
                                        <View style={[styles.container, { alignItems: 'center' }]}>
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
                                </Text> */}<View style={styles.row}>

                                                <Text style={styles.text}>Min </Text>
                                                <TextInput
                                                    style={styles.input}
                                                    keyboardType='number-pad'
                                                    placeholder={`$ ${min}`}
                                                    placeholderTextColor={colors.blue.primary}
                                                    onSubmitEditing={text => this.props.setFilter({ 'field': field, 'comparison': gt, 'values': [parseFloat(text.nativeEvent.text)] })} />

                                                <Text style={styles.text}>Max</Text>
                                                <TextInput
                                                    keyboardType='number-pad'
                                                    placeholder={`$ ${max}`}
                                                    placeholderTextColor={colors.blue.primary}
                                                    style={styles.input}
                                                    onSubmitEditing={text => this.props.setFilter({ 'field': field, 'comparison': lt, 'values': [parseFloat(text.nativeEvent.text)] })}
                                                />
                                            </View>

                                        </View>
                                    </View>
                                )
                            }
                        })}

                        <Text style={styles.heading}>Sort</Text>
                        <View style={styles.container}>
                            {sortOptions.map((option, i) => {

                                let selected = (this.props.sort.filter(currOptionVal => _.isEqual(currOptionVal, option.value)).length > 0)
                                console.log(selected)
                                let { value, title } = option
                                if (selected) {
                                    value = { ...option.value, 'remove': true }
                                    title = option.title + ' (Selected)'
                                }
                                return (

                                    <View key={i} style={styles.row}>
                                        <RadioButton
                                            value={title}
                                            label={title}
                                            uncheckedColor={'#E6F0FD'}
                                            color={colors.blue.primary}
                                            status={title.includes("Selected") ? 'checked' : 'unchecked'}
                                            onPress={() => this.props.setSort(value)}
                                        />
                                        <Text style={styles.text}>{title.replace('(Selected)', '')}</Text>
                                    </View>


                                )
                            })}
                        </View>
                    </ScrollView>
                    <AppButton text={"APPLY"} style={{ marginHorizontal: 10 }} onPress={() => this.props.close(false)}/>

                </View>
            </Modal>
        )
    }

}
const styles = StyleSheet.create({
    modalView: {
        backgroundColor: colors.background.light,
        flex: 1,
        paddingTop: 20,
        marginTop: 70,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    container: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 10,
        marginTop: 10
    },
    heading: { paddingTop: 10, fontSize: sizes.s17, fontFamily: 'medium', color: colors.grey.primary },
    text: { fontSize: sizes.s16, fontFamily: 'medium', color: colors.text },
    input: { backgroundColor: colors.blue.light, marginHorizontal: 20, paddingHorizontal: 20, padding: 5, borderRadius: 10, color: colors.blue.primary }
})
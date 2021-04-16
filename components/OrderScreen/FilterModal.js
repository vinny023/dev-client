import _ from 'lodash';
import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { View, Button, Text, TextInput } from 'react-native';

const sortOptions = [
    {'title': 'Price Low To High', 'value':{'price':1}},
    {'title': 'Price High To Low', 'value':{'price':-1}},
    {'title': 'Recently Ordered', 'value':{'orderHistory':1}},
    {'title': 'Size Low To High', 'value':{'size':1}},
    {'title': 'Size High To Low', 'value':{'size':-1}},
    {'title': 'Qty Low To High', 'value':{'qtyPerItem':1}},
    {'title': 'Qty High To Low', 'value':{'qtyPerItem':-1}}
]

const filterOptions = [
    {'title':'Supplier', 'field':'supplierDisplayName', 'options':[]},
    {'title':'Units', 'field':'units', 'options':[]},
    {'title':'Price', 'field':'price', 'min':999999, 'max':-999999},
    {'title':'Size', 'field':'size', 'min':999999, 'max':-999999}   , 
    {'title':'Qty', 'field':'qtyPerItem', 'min':999999, 'max':-999999}        
  ]

  const getFilters = (productList) => {
    console.log('IN FUCNTION PLIST')
    console.log(productList)

    productList.forEach(product => {
      const {supplierDisplayName, supplierId, units, price, size, qtyPerItem} = product
      const propertyArray= [supplierDisplayName, units, price, size, qtyPerItem]

    filterOptions.forEach((filterOption, index) => {
            if (filterOption.title === 'Supplier' || filterOption.title === 'Units') {
                if (filterOptions[index].options.filter(option => propertyArray[index] === option).length === 0) {
                    filterOptions[index].options.push(propertyArray[index])
                }                   
            } else {
                let newVal = propertyArray[index]                      
                if (newVal > filterOptions[index].max) {filterOptions[index].max = newVal}
                if (newVal < filterOptions[index].min) {filterOptions[index].min = newVal}
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
            <View>
            <Text>Filter & Sort</Text>
            <Button 
                    onPress={() => this.props.close(false)} 
                    title="X"
            />
            <Text>Filter</Text>    
            {filterOptions.map((filterOption, i) => {
                const {title, field, options, min, max} = filterOption
                
                if (title === 'Supplier' || title === 'Units') {
                    //SELECTION FILTER
                    return (
                        <View key={i}>            
                        {options.length > 0 && <Text>{title}</Text>}
                        {
                            options.map((option,k) => {
                                let selected = (this.props.filter
                                    .filter(currOptionVal => currOptionVal.field === field && currOptionVal.values.indexOf(option) !== -1).length > 0)
                                

                                //CHECK IF SELECTED
                                let filterValue = {'field':field, 'comparison':':', 'value':option}
                                let label = option;
                                if (selected) {
                                    label = label + '(Selected)'
                                    filterValue = {...filterValue, 'remove':true}
                                }
                                    return ( 
                                        <Text>
                                        <Button key={k}
                                        onPress={() => this.props.setFilter(filterValue)}
                                        title='O'
                                        />
                                        {label}
                                        </Text>                                    
                                    )
                                
                            })
                        }
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
                        <View>
                        <Text>{title}</Text>
                         <Text>Min ({min}): <TextInput 
                                        keyboardType = 'number-pad'  
                                        defaultValue = {minValue}
                                        onSubmitEditing= {text => this.props.setFilter({'field':field, 'comparison': gt, 'values':[parseFloat(text.nativeEvent.text)]})}
                                            />
                            <Button title="X" onPress={() => this.props.setFilter({'field':field, 'comparison': gt, 'remove':true})}/>
                        </Text>
                        <Text>Max ({max}): <TextInput 
                                        // keyboardType = 'number-pad'   
                                        defaultValue = {maxValue}           
                                        onSubmitEditing= {text => this.props.setFilter({'field':field, 'comparison': lt, 'values':[parseFloat(text.nativeEvent.text)]})}
                                            />
                            <Button title="X" onPress={() => this.props.setFilter({'field':field, 'comparison': lt, 'remove':true})}/>
                        </Text>                         
                        </View>
                    )
                }                
            })}            

            <Text>Sort</Text>
            {sortOptions.map((option,i) => {      
                
                let selected = (this.props.sort.filter(currOptionVal => _.isEqual(currOptionVal,option.value)).length > 0)
                console.log(selected)       
                let {value, title} = option
                if (selected) {
                    value = {...option.value, 'remove':true}
                    title = option.title + ' (Selected)'
                }                 
                return (
                    <Button
                        title={title}
                        onPress={() => this.props.setSort(value)}
                        key={i}
                    />
                )
            })}
            </View>
        )
    }

}
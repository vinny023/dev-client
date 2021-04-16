import React from 'react';
import { render, shallow, mount } from 'enzyme';
import {Text, View} from 'react-native'
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-15';
import {create} from 'react-test-renderer'
// import configureStore from 'redux-mock-store'; // Smart components

// Component to be tested
import { PlusMinusList } from '../components/PlusMinusList'
import { ProductListItem } from '../components/ProductListItem'


import {testItemList, testCart} from './setup/TestConfig'

describe('PlusMinus', () => {

    const wrapper = shallow(<PlusMinusList list={testItemList} cart={[]}/>)
    wrapper.debug()
    
    test('renders the component', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
    })

    test('renders the component with ALL elements of list prop with empty cart', () => {
        const listItems = wrapper.find(ProductListItem)
        expect(listItems.length-1).toEqual(testItemList.length)
    })

    test('renders correct cart quantities', () => {
        const wrapper = shallow(<PlusMinusList list={testItemList} cart={testCart}/>)
        const listItems = wrapper.find(View)

        const check = [];
        testCart.map(cartItem => {
            itemViewWrapper = wrapper.findWhere(node => node.key() === cartItem.sku)
            if (itemViewWrapper.length > 0) {
              cartItemWrapper = wrapper.findWhere(node => node.key() === cartItem.sku).first()          
              check.push(cartItemWrapper.contains(<Text>{cartItem.quantity}</Text>))
            } 
        })

        expect(check).toEqual(testCart.map(() => true))        
    })      

 })
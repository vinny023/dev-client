import React from 'react';
import { render, shallow, mount } from 'enzyme';
import {Text, View} from 'react-native'
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-15';
import {create} from 'react-test-renderer'
// import configureStore from 'redux-mock-store'; // Smart components

// Component to be tested
import SelectorListItem from '../components/SelectorListItem'

import {SelectorListItemTestProps} from './setup/TestConfig'

describe('PlusMinus', () => {

    const wrapper = shallow(<SelectorListItem/>)
    
    test('renders the component', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
    })

    // test('renders the component with correct props', () => {
      
    // })

    // test('navigates to the correct screen and passes the correct props', () => {

    // })      

 })
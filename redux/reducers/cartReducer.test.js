import cartReducer from './cartReducer'
import * as actions from '../actions'
import expect from 'expect';

import React from 'react';
import { render, shallow, mount } from 'enzyme';
import {Text, View} from 'react-native'
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-15';
import {create} from 'react-test-renderer'

describe('cart reducer', () => {

    // test('add 1 new item & new supplier', () => {
    //     const action = {
    //         type: 'ADD_ITEM',
    //         payload: {item: {...newItemNewSupp}, amount: 1}
    //     }
    //     expectedOutput = [...multiSupplierCart, {supplier: {...newItemNewSupp.supplier}, cart:[{...newItemNewSupp, quantity: 1}]}]

    //     console.log(expectedOutput)

    //     expect(cartReducer({masterCart:multiSupplierCart}, action).masterCart).toEqual(expectedOutput)
    // })

    test('remove item of first supplier in cart with only 1 item', () => {
        const action = {
            type: 'SUBTRACT ITEM',
            payload: {item: {...suppOneItem}, amount: 1}
        }
        
        console.log("TEST 1")
        console.log(singleSupplierTwoCart)

        console.log(cartReducer({masterCart:multiSupplierCart}, action).masterCart)

        expect(cartReducer({masterCart:multiSupplierCart}, action).masterCart).toEqual(singleSupplierTwoCart)
    })

    test('remove item of second supplier in cart with only 1 item', () => {
        const action = {
            type: 'SUBTRACT ITEM',
            payload: {item: {...suppTwoItem}, amount: 1}
        }

        console.log("TEST 2")
        console.log(singleSupplierOneCart)

        console.log(cartReducer({masterCart:multiSupplierCart}, action).masterCart)

        expect(cartReducer({masterCart:multiSupplierCart}, action).masterCart).toEqual(singleSupplierOneCart)
    })



//   it('should return the initial state');
//   it('should handle GET_POST_SUCCESS');
//   it('should handle UPDATE_POST_SUCCESS');
//   it('should handle GET_POST_FAIL');
//   it('should handle GET_POST_START');
});



const newItemNewSupp = {sku: '003', supplier: {supplierId: 2, title: "New Supplier"}}

const newItemSameSupp = {}

const sameItemSameSupp = {}

const emptyCartState = []

const suppOneItem = {sku: '001', supplier: {supplierId: 0, title:"Restaurant Depot"}}

const suppTwoItem = {sku: '002', supplier: {supplierId: 0, title:"Bartlett"}}

const singleSupplierOneCart = [
    {
        supplier: {supplierId: 0, title:"Restaurant Depot"},
        cart: [
            {...suppOneItem, quantity: 1}
        ]
    }
]

const singleSupplierTwoCart = [
    {
        supplier: {supplierId: 1, title:"Bartlett"},
        cart: [
            {...suppTwoItem, quantity: 1}
        ]
    }

]

const multiSupplierCart = [
    {
        supplier: {supplierId: 0, title:"Restaurant Depot"},
        cart: [
            {...suppOneItem, quantity: 1}
        ]
    },

    {
        supplier: {supplierId: 1, title:"Bartlett"},
        cart: [
            {...suppTwoItem, quantity: 1}
        ]
    }

]



import axios from 'axios'
import { NETLIFY, headers} from '../env.js'

export const setOrder = async({id, update}) => { 
    console.log(NETLIFY+'setOrder?id='+id+'&update='+encodeURI(JSON.stringify(update)))
    const returnval = await axios.get(NETLIFY+'setOrder?id='+id+'&update='+encodeURI(JSON.stringify(update)))
    if (returnval.status === 200) {
        return returnval.data.response             
    }  else {
        throw 500
    } 
}

export const getOrders = async({query}) => { 
    console.log(NETLIFY+'getOrders?query='+encodeURI(JSON.stringify(query)))
    const returnval = await axios.get(NETLIFY+'getOrders?query='+encodeURI(JSON.stringify(query)))    
    if (returnval.status === 200) {
        return returnval.data.orders             
    }  else {
        throw 500
    } 
}


export const placeOrder = async({supplierOrder})  => {
    console.log(NETLIFY+'placeOrder?supplierOrder='+encodeURI(JSON.stringify(supplierOrder)))
    const returnval = await axios.get(NETLIFY+'placeOrder?supplierOrder='+encodeURI(JSON.stringify(supplierOrder)))
    if (returnval.status === 200) {
        return returnval.data.emailSent             
    }  else {
        throw 500
    }    
}

export const getCartSuppliers = async({suppliers}) => {

    console.log(NETLIFY+'getCartSuppliers?suppliers='+encodeURI(JSON.stringify(suppliers)))
    const supplierList = await axios.get(NETLIFY+'getCartSuppliers?suppliers='+encodeURI(JSON.stringify(suppliers)), headers)
    if (supplierList.status === 200) {
        return supplierList.data
    } else {
        throw 500       
    }    
}

export const getProducts = async({search, filter, sort, initialFilter, accountId}) => {


    //PUT QUOTES AROUND STRING VALUES fOR FILTER SO ALGOLIA CAN ACCEPT THEM
    const modFilter = filter.map(filter => {
        const moddedFilter = {...filter}
        if (filter.field === 'supplierDisplayName' || filter.field === 'units') {
            moddedFilter.values = moddedFilter.values.map(value => `"${value}"`)
        }
        return moddedFilter
    })
    
    //BUILD QUERY STRING
    let queryString = '?accountId='+accountId+'&'
    if (search !== '') { queryString += 'search='+encodeURI(search)+"&" } 
    if ([...initialFilter, ...modFilter].length !== 0) { queryString += 'filterQuery='+encodeURI(JSON.stringify([...initialFilter, ...modFilter]))+"&" }
    if (sort.length !== 0) {queryString += 'sortQuery='+encodeURI(JSON.stringify(sort))}

    //GET PRODUCTS BASED ON QUERY   
    const productList = await axios.get(NETLIFY+'getProducts'+queryString, headers)
    if (productList.status === 200) {
        return productList.data.products
    } else {
        throw 500     
    }

    
}
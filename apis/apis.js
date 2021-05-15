import axios from 'axios'
import { NETLIFY, headers} from '../env.js'

const apiTries = 3

export const getAccount = async({query}) => { 
    console.log(NETLIFY+'getAccount?query='+encodeURI(JSON.stringify(query)))

    for (let i = 0; i< apiTries; i++) {
        const returnval = await axios.get(NETLIFY+'getAccount?query='+encodeURI(JSON.stringify(query)))    
        if (returnval.status === 200) {   
            console.log('RETURNE ACCOUNT');
            console.log(returnval.data.account)                 
            if (returnval.data.account.length > 0) {
                return returnval.data.account[0]
            }
             else {
                return 'account not found'
             }
        }  else if (i === apiTries-1) {
            throw 500
        } 
    }

}

export const setAccount = async({id, update}) => { 
    console.log(NETLIFY+'setAccount?id='+id+'&update='+encodeURI(JSON.stringify(update)))
    
    for (let i = 0; i< apiTries; i++) {
    const returnval = await axios.get(NETLIFY+'setAccount?id='+id+'&update='+encodeURI(JSON.stringify(update)))
    if (returnval.status === 200 && returnval.data.response) {
        return returnval.data.response             
    }  else if (i === apiTries-1) {
        throw 500
    } 
}
}

export const setOrder = async({id, update}) => { 
    console.log(NETLIFY+'setOrder?id='+id+'&update='+encodeURI(JSON.stringify(update)))
    
    for (let i = 0; i< apiTries; i++) {
    const returnval = await axios.get(NETLIFY+'setOrder?id='+id+'&update='+encodeURI(JSON.stringify(update)))
    if (returnval.status === 200 && returnval.data.response) {

        return returnval.data.response             
    }  else if (i === apiTries-1) {
        throw 500
    } 
}
}

export const getOrders = async({query, sort}) => { 
    console.log(NETLIFY+'getOrders?query='+encodeURI(JSON.stringify(query))+"&sort="+encodeURI(JSON.stringify(sort)))
 
    for (let i = 0; i< apiTries; i++) {
    const returnval = await axios.get(NETLIFY+'getOrders?query='+encodeURI(JSON.stringify(query))+"&sort="+encodeURI(JSON.stringify(sort)))    
    if (returnval.status === 200 && returnval.data.orders) {     
        return returnval.data.orders             
    }  else if (i === apiTries-1) {
        throw 500
    } 
}
}


export const placeOrder = async({supplierOrder})  => {
    console.log(NETLIFY+'placeOrder?supplierOrder='+encodeURI(JSON.stringify(supplierOrder).replace(/#/g,"HTAG")))
  
    for (let i = 0; i< apiTries; i++) {
    const returnval = await axios.get(NETLIFY+'placeOrder?supplierOrder='+encodeURI(JSON.stringify(supplierOrder).replaceAll(/#/g,"HTAG")))
    
    if (returnval.status === 200 && returnval.data.orderSent) {       
        return returnval.data.orderSent   
    } else if (i === apiTries-1) {
        throw 500
    }   
    } 
}

export const getCartSuppliers = async({suppliers}) => {

    console.log(NETLIFY+'getCartSuppliers?suppliers='+encodeURI(JSON.stringify(suppliers)))
    
    for (let i = 0; i< apiTries; i++) {
        const supplierList = await axios.get(NETLIFY+'getCartSuppliers?suppliers='+encodeURI(JSON.stringify(suppliers)), headers)
        
        if (supplierList.status === 200 && supplierList.data.suppliers) {        
            return supplierList.data.suppliers
        } else if (i === apiTries-1) {
            throw 500       
        }   
    } 
}

export const getProducts = async({search, filter, sort, initialFilter, accountId}) => {


    //PUT QUOTES AROUND STRING VALUES FOR FILTER SO ALGOLIA CAN ACCEPT THEM
    const modFilter = filter.map(filter => {
        const moddedFilter = {...filter}
        
        if (['supplierDisplayName', 'units', 'qtyString', 'sku', 'brand'].indexOf(filter.field) !== -1 || filter.field.includes('orderGuide')) {
            moddedFilter.values = moddedFilter.values.map(value => `"${value}"`)
        }
        return moddedFilter
    })
    
    //BUILD QUERY STRING
    let queryString = '?accountId='+accountId+'&'
    if (search !== '') { queryString += 'search='+encodeURI(search)+"&" } 
    if ([...initialFilter, ...modFilter].length !== 0) { queryString += 'filterQuery='+encodeURI(JSON.stringify([...initialFilter, ...modFilter]))+"&" }
    if (sort.length !== 0) {queryString += 'sortQuery='+encodeURI(JSON.stringify(sort))}

    console.log("GET PRODUCTS CALL")
    console.log(NETLIFY+'getProducts'+queryString)

    //GET PRODUCTS BASED ON QUERY   
    for (let i = 0; i< apiTries; i++) {
    const productList = await axios.get(NETLIFY+'getProducts'+queryString, headers)
    if (productList.status === 200 && productList.data.products) {    
        return productList.data
    } else if (i === apiTries-1) {
        throw 500     
    }
    }

    
}
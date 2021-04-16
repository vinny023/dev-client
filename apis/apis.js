import axios from 'axios'
import { NETLIFY, headers} from '../env.js'


export const placeOrder = async({supplierOrder})  => {
    console.log(NETLIFY+'placeOrder?supplierOrder='+encodeURI(JSON.stringify(supplierOrder)))
    const returnval = await axios.get(NETLIFY+'placeOrder?supplierOrder='+encodeURI(JSON.stringify(supplierOrder)))
    return returnval
}

export const getSuppliers = async({suppliers}) => {

    console.log(NETLIFY+'getSuppliers?suppliers='+encodeURI(JSON.stringify(suppliers)))
    const supplierList = await axios.get(NETLIFY+'getSuppliers?suppliers='+encodeURI(JSON.stringify(suppliers)), headers)
    return supplierList.data
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

    return productList.data.products
}
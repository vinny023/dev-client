const baseURL = "https://elastic-beaver-a020d9.netlify.app/.netlify/functions/"

//GET ACCOUNT
//BOTH SHOULD RETURN OBJECT {account: ARRAY OF ACCOUNTS}
const idQuery = {id: 'arvindsdeli'}
const codeQuery = {code: '12345'}

const getAccountWithId = baseURL + "getAccount?query="+JSON.stringify(idQuery)
const getAccountWithCode = baseURL + "getAccount?query="+JSON.stringify(codeQuery)

// GET CART SUPPLIERS
//SHOULD RETURN OBJECT {suppliers: ARRAY OF SUPPLIERS}
const suppliers = ['sysco', 'woolco']
const callstring = baseURL + "getCartSuppliers?suppliers="+JSON.stringify(suppliers)

//GET ORDERS
//RETURN OBJECT {orders: ARRAY OF ORDERS}
const idQuery = {id: 'arvindsdeli-sysco-2021.3.17.20.33-[["sysco-61208",3],["sysco-741520",2]]'} //should return array of 1 order
const accountQuery = {accountId: 'arvindsdeli', }
const accountAndSupplierQuery = {...accountQuery, supplierId: 'sysco'}
const accountAndstatusQuery = {accountQuery, status: 'Delivered'} //should return array of 2 orders 

const getOrderWithId = baseURL + 'getOrders?query='+JSON.stringify(idQuery)
//***PLEASE REPEAAT FOR OTHER QUERIES ^

//SET ORDERS
const id = 'arvindsdeli-sysco-2021.3.17.20.33-[["sysco-61208",3],["sysco-741520",2]]'
const update = {status: 'Queued'}

const setOrder = baseURL + 'setOrders?id='+id+'update='+JSON.stringify(update)

//GET PRODUCTS
const accountId = 'arvindsdeli'
const search = 'chicken'
const page = 0
sortQuery = {price: -1} // SORT PRICE HIGH TO LOW - to sort in ascending order, set value to 1
filterQuery = [
    {
        field: 'supplier',
        comparison: ':',
        values: ['sysco', 'usfoods']
    },
    {
        field: 'price',
        comparison: '$gt', //use $LT for less ten
        values: [15]
    },
    {
        field: 'sku',
        comparison: ':',
        values: ['us_foods-150'] //this last filter will cause only 1 item to be outputted
    }
]

const getProducts = baseURL + 'getProducts?search='+search+'accountId='+accountId+'page='+page+'sortQuery='+JSON.stringify(sortQuery)+'filterQuery='+JSON.stringify(filterQuery)



//handleHook


//Place Order
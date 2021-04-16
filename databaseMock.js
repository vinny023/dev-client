//USER
export const myRestaurantAccount = {
    id: 'arvindsdeli',
    displayName: "Arvind's Deli",
    users: [],
    confirmationEmail: "aanandacoumar@gmail.com",
    activeSuppliers: [],
    supplierContact: {
        'sysco': {'contact':'syscosupplyhero@gmail.com', 'contactType':'email'},
        'woolco': {'contact':'woolcosupplyhero@gmail.com', 'contactType':'email'},
        'driscoll': {'contact':'driscollsupplyhero@gmail.com', 'contactType':'email'},
        'aceendico': {'contact':'aceendicosupplyhero@gmail.com', 'contactType':'email'},
        'usfoods': {'contact':'usfoodssupplyhero@gmail.com', 'contactType':'email'},
    },
    logo: 'https://bcassetcdn.com/public/blog/wp-content/uploads/2019/07/18094833/the-red-cafe.png',

    cart: [],

    orders: [],

    searchSuggestions: ['Chicken', 'Avocado', 'Milk', 'Bananas'],

    //YOU COULD CACHE THESE ITEMS
    orderGuide: ["sysco-100","ace_endico-110","us_foods-115"],
    supplierList: [
        {supplier: 0, placeOrderMethod: "email", orderContactInfo: "restaurantDepot@supplyhero.co"},
        {supplier: 1, placeOrderMethod: "text", orderContactInfo:"19085667543"},
    ],    

    //EXPLORE
    // searchFullProductList: {type:'products',list:[0,1,2]},
    // exploreLists: {type:'list', list:[0,1,2]}

    // variantPriceList: [ SO EVERY USER CAN HAVE CUSTOM PRICING
    //     {variant: 0,}.
    //     {variant: 0,}.
    //     {variant: 0,}.
    //     {variant: 0,}.
    // ]

    //shipPriceLIst: so every user can have cusotm shipping options
}

export const Suppliers = [
    RestaurantDepotSupplier,
    BartlettSupplier
]

export const Lists = [
    FruitsCategory,
    MeatsCategory,
    PackagingCategory
]

export const globalProducts = [
    avocadoProduct,
    chickenProduct,
    platesProduct,
]

export const globalVariants = [
    avocadoSmall,
    avocadoLarge,
    chickenMedium,
    chickenWellDone,
    plates100ct,
    plates500ct
]

//SUPPLIERS
export const RestaurantDepotSupplier = {
    id: "RestaurantDepotuser001",
    title: "Restaurant Depot",  
    image: "https://i.ytimg.com/vi/T1eLBvecuC4/maxresdefault.jpg",
    shippingOptions:[ship1, ship2],
    email: "",
    contact: "",
    lists: [0,1],  
}

export const BartlettSupplier = {
    id: "Bartlettuser001",
    title: "Bartlett",
    userID: "user001",
    image: "https://i.ytimg.com/vi/T1eLBvecuC4/maxresdefault.jpg",
    placeOrderMethod: "text",
    orderContactInfo: "19085667543",
    shippingOptions:[ship1, ship2],
    email: "",
    contact: "",
    lists: [2],      
}

export const ship1 = {
    id: ship1,
    title: 'Next Day Delivery', 
    time: 1,
    cutoffTime: 16,
    availableToW: [
        {day: 1, startTime: 10, endTime: 14},
        {day: 2, startTime: 10, endTime: 14},
        {day: 3, startTime: 10, endTime: 14},
        {day: 4, startTime: 10, endTime: 14},
        {day: 5, startTime: 10, endTime: 14},
    ],     
    flatFee: 2500,
    variableRate: 0.04,
    orderMinimum: 50000,  
    smallCartFee: 2500,
}

export const ship2 = {
    id: ship2,
    title: 'Thursday Service', 
    time: 1,
    cutoffTime: 16,
    availableToW: [
        {day: 3, startTime: 10, endTime: 14},
        {day: 3, startTime: 14, endTime: 18},
        {day: 3, startTime: 18, endTime: 22},
        {day: 3, startTime: 22, endTime: 26},
    ],     
    flatFee: 1500,
    variableRate: 0.02,
    orderMinimum: 50000,  
    smallCartFee: 2500,
}


//CATEGORIES
export const FruitsCategory = {
     id: "Fruits1",
     type: "Product",
     title: "Fruits",
     listItems: [0],
     image: "https://www.diagnosisdiet.com/assets/images/c/fruit-og-d176ef00.jpg"
     
}

export const MeatsCategory = {
    id: "FreshMeat1",
    type: "Product",
    title: "Fresh Meat",
    listItems: [1],
    image: "https://www.credit.com/blog/wp-content/uploads/2016/04/butcher_shop.jpg"
}

export const PackagingCategory = {
    id: "PaperPackaging1",
    type:"Product",
    title: "Paper & Packaging",
    listItems: [2],
    image: "https://i2.wp.com/pakfactory.com/blog/wp-content/uploads/2017/01/kraftpackaging.jpg?fit=1200%2C790&ssl=1"
}

//PRODUCTS
export const avocadoProduct = {
    id: 'avocadoProduct',
    title: 'Avocados',
    displayImage: "https://www.washingtonian.com/wp-content/uploads/2020/02/iStock-1027572462-scaled-2048x1695.jpg",
    variants: [avocadoSmall, avocadoLarge],
    supplier: {id: 0, title:"Restaurant Depot"},
    categories: [{id:0, title:'Fruits'}]
}

export const chickenProduct = {
    id: 'chickenProduct',
    title: 'Chicken',
    displayImage: "https://www.washingtonian.com/wp-content/uploads/2020/02/iStock-1027572462-scaled-2048x1695.jpg",
    variants: [chickenMedium, chickenWellDone],
    supplier: {id: 0, title:"Restaurant Depot"},
    categories: [{id:1, title:'Fresh Meat'}]
}

export const platesProduct = {
    id: 'platesProduct',
    title: 'Paper Plates',
    displayImage: "https://m.media-amazon.com/images/I/71ca8STSacL._AC_SS350_.jpg",
    variants: [plates100ct, plates500ct],
    supplier: {id: 2, title:"Bartlett"},
    categories: [{id:2, title:'Paper & Packaging'}]
}

//VARIANTS

export const avocadoSmall = {
    title: 'Avocado - Small',
    options: {type: 'Size', label: 'Small'},
    description: 'Avocados deliciosup icked from yada yda. Small Size.',
    UPC: '10001',
    sku: 'avocadoSmall',
    price: 1500,
    numUnits: 5,
    unit: 'avocado',
    brand: 'Hass',
    images:["https://www.washingtonian.com/wp-content/uploads/2020/02/iStock-1027572462-scaled-2048x1695.jpg", "https://www.washingtonian.com/wp-content/uploads/2020/02/iStock-1027572462-scaled-2048x1695.jpg"],
    supplier: {id: 0, title:"Restaurant Depot"},
    categories: [{id:0, title:'Fruits'}]
}

export const avocadoLarge = {
    title: 'Avocado - Large',
    options: {type: 'Size', label: 'Large'},
    description: 'Avocados deliciosup icked from yada yda. Small Size.',
    UPC: '10002',
    sku: 'avocadoLarge',
    price: 3000,
    numUnits: 5,
    unit: 'avocado',
    brand: 'Hass',
    images:["https://www.washingtonian.com/wp-content/uploads/2020/02/iStock-1027572462-scaled-2048x1695.jpg", "https://www.washingtonian.com/wp-content/uploads/2020/02/iStock-1027572462-scaled-2048x1695.jpg"],
    supplier: {id: 0, title:"Restaurant Depot"},
    categories: [{id:0, title:'Fruits'}]
}

export const chickenMedium = {
    title: 'Chicken - Medium Roast',
    options: {type: 'Roast', label: 'Roast'},
    description: 'Chicekn roasted to medium perfection.',
    UPC: '10003',
    sku: 'chickenMedium',
    price: 3000,
    numUnits: 20,
    unit: 'lb',
    brand: 'Greenland Farms',   
    images:["https://www.simplyrecipes.com/wp-content/uploads/2019/03/HT-Make-Roast-Chicken-LEAD-5v2.jpg"],
    supplier: {id: 0, title:"Restaurant Depot"},
    categories: [{id:1, title:'Fresh Meat'}]
}

export const chickenWellDone = {
    title: 'Chicken - WEll Done Roast',
    options: {type: 'Roast', label: 'Well Done'},
    description: 'Chicekn roasted to welldone perfection.',
    UPC: '10004',
    sku: 'chickenWellDone',
    price: 4000,
    numUnits: 20,
    unit: 'lb',
    brand: 'Greenland Farms',   
    images:["https://www.simplyrecipes.com/wp-content/uploads/2019/03/HT-Make-Roast-Chicken-LEAD-5v2.jpg"],
    supplier: {id: 0, title:"Restaurant Depot"},
    categories: [{id:1, title:'Fresh Meat'}]
}

export const plates100ct = {
    title: 'Plates 100 Ct',
    options: {type: 'Quantity', label: '100 Ct'},
    description: 'Plates are the best, 100 cout',
    UPC: '10005',
    sku: 'plates100',
    price: 1000,
    numUnits: 100,
    unit: 'plate',
    brand: 'Sunset',   
    images:["https://m.media-amazon.com/images/I/71ca8STSacL._AC_SS350_.jpg"],
    supplier: {id: 0, title:"Bartlett"},
    categories: [{id:1, title:'Paper & Packaging'}]
}

export const plates500ct = {
    title: 'Plates 500 Ct',
    options: {type: 'Quantity', label: '500 Ct'},
    description: 'Plates are the best, 100 cout',
    UPC: '10005',
    sku: 'plates500',
    price: 4000,
    numUnits: 500,
    unit: 'plate',
    brand: 'Sunset',   
    images:["https://m.media-amazon.com/images/I/71ca8STSacL._AC_SS350_.jpg"],
    supplier: {id: 0, title:"Bartlett"},
    categories: [{id:1, title:'Paper & Packaging'}]
}



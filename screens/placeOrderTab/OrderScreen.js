import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { View, Text, Button, ScrollView, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback , BackHandler, ToastAndroid } from 'react-native';
import { connect } from 'react-redux'
import SwitchMode from '../../components/OrderScreen/SwitchMode'
import FilterModal from '../../components/OrderScreen/FilterModal'
import Search from '../../components/OrderScreen/Search'
import ProductListItem from '../../components/Global/ProductListItem'
import ProductList from '../../components/Global/ProductList'
import Banner from '../../components/Global/Banner'
// import CartButton from '../../components/Global/CartButton'
import { getProducts } from '../../apis/apis'
import _ from 'lodash'
import { colors, commonStyles, sizes } from '../../theme';
import { showMessage, hideMessage } from "react-native-flash-message";
import AppButton from '../../components/Global/AppButton';
import { compress, decompress } from 'compress-json'
import firebaseApp from '../../firebaseConfig'

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback 
  onPress={() => Keyboard.dismiss()}> {children}
  </TouchableWithoutFeedback>
);


let counter = 0;

const fakeCart = ({account}) => {

  if (counter === 0) {

  console.log('BUILDLING FAKE STATE');

  let masterCart = []
  for (let i = 1; i < 21; i++) { 
    masterCart.push({supplierId:'supplier'+i, cart:[]})
  }

  for (let i = 1; i < 5000; i++) {

    masterCart[i%20].cart.push({
    "aisle": 1,
    "arvindsdeli-orderGuide": "yes",
    "brand": "Test Brand",
    "category": "Test Category",
   "displayName": "Test "+i,
    "objectID": "Test "+i,
    "qtyPerItem": 10,
    "qtyString": "12 per case  ·  16 fl oz",
    "quantity": 31,
    "size": 10,
    "sku": "Test "+i,
    "supplierDisplayName": 'Supplier '+(i%20+1),
    "supplierId": 'supplier'+(i%20+1),
    "supplierItemId": i,
    "units": "fl oz",
    "upc": i,
    "price": 44.43
    })
  }
  console.log('FiNISHED CART')
  console.log(masterCart)

  console.log('ACOUNT');


  let state = {
    "accountState":{"account":account},
    "cartState":{
          "masterCart":masterCart
    }
      }
    
  
  console.log('FiNISHED STATE')
  console.log(state);

  console.log('Compressed State')
  let compressedState = JSON.stringify(compress(JSON.parse(JSON.stringify(state))))
  console.log(compressedState)

firebaseApp.database().ref('customers/urbangreensdemo').set({
    // state: JSON.parse(JSON.stringify(state))
    state: compressedState
})


  console.log('PARSED COMPRESSED STATE');
  console.log(JSON.parse(compressedState));

  counter = 1;
}

}

export class OrderScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      search: '',
      initialFilter: [],
      filter: [],
      sort: [],
      title: '',
      availableFilters: [],
      // showSearchSuggestions: false,
      showFilter: false,
      productList: [],
      numPages: 0,
      currentPage: 0,
      loading: true,
      accountId: this.props.account.id,
      isError: false,
      banner: { show: false, type: '', message: '' },
      isSuggestionSet: false

    }

    //HANDLE STATE INITIALIZATION     
    if (this.props.initialState) {
      if (this.props.initialState === 'orderGuide') {
        this.state.initialFilter = [{ 'field': this.props.account.id+'-orderGuide', 'comparison': ':', 'values': ['yes'] }]
        this.state.sort = [{ 'lastOrderDate': -1 }]
        this.state.title = 'Order Guide'
      } else if (this.props.initialState === 'fullCatalog') {
        this.state.title = 'Browse Full Catalog'
        this.state.initialFilter = [{ 'field': 'supplierDisplayName', 'comparison': ':', 'values': this.props.account.displaySuppliers.map(supplier => '"'+supplier+'"') }]
        this.state.title = 'Full Catalog'
      }
    }
    //DEFAULT TO CATALOG - ****SWITCH BACK******
    else {
      // this.state.initialFilter = [{ 'field': 'sku', 'comparison': ':', 'values': this.props.account.orderGuide }]
      this.state.initialFilter = [{ 'field': this.props.account.id+'-orderGuide', 'comparison': ':', 'values': ['yes'] }]
      this.state.title = 'Order Guide'
      // this.state.title = 'Browse Full Catalog'     
    }

    //SET CUSTOM PROPS IF PROPS ARE VALID
    const { propTitle, propFilter, propSort, propSearch, propSuggestion } = this.props
    if (propTitle) { this.state.title = propTitle }
    if (propFilter) { this.state.filter = [...this.state.filter, ...propFitler] }
    if (propSort) { this.state.filter = [...this.state.filter, ...propSort] }
    if (propSearch) { this.state.search = propSearch }
    if (propSuggestion) { this.state.isSuggestionSet = propSuggestion }

    //BIND FUNCTIONS TO PASS STATE UP
    this.setMode = this.setMode.bind(this)
    this.toggleFilterModal = this.toggleFilterModal.bind(this)
    this.setSearch = this.setSearch.bind(this)
    this.setSuggestion = this.setSuggestion.bind(this)
    this.setSort = this.setSort.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.clearFilter = this.clearFilter.bind(this)
    // this.setProductList = this.setProductList.bind(this)
  }

  //HELPER METHODS
  setMode(newMode) {
    if (newMode === 'Order Guide') {
      this.setState({
        initialFilter: [{ 'field': this.props.account.id+'-orderGuide', 'comparison': ':', 'values': ['yes'] }],
        title: 'Order Guide'
      })
    } else if (newMode === 'Catalog') {
      this.setState({
        initialFilter: [{ 'field': 'supplierDisplayName', 'comparison': ':', 'values': this.props.account.displaySuppliers.map(supplier => '"'+supplier+'"') }],
        title: 'Browse Full Catalog'
      })
    }
  }

  toggleFilterModal(showBool) {
    this.setState({ showFilter: showBool })
  }

  setSearch(term) {
    this.setState({ search: term })
    this.setState({ isSuggestionSet: false })

  }
  setSuggestion(val) {
    this.setState({ isSuggestionSet: val })

  }

  clearFilter() {
    // console.log('RUNNING CLEAR FILTER ORDERSCREEN');
    this.setState({
      filter: [],
      sort: [],
    })
  }

  setFilter(newFilter) {
    //handle Remove    
    let type = 'qty'
    const selectorFields = ['supplierDisplayName', 'units', 'brand', 'qtyString']
    if (selectorFields.indexOf(newFilter.field) !== -1) {
      type = 'select'
      newFilter.values = [newFilter.value]
      delete newFilter.value
    }

    let isNew = true;
    let matchIndex = -1

    //check if filter already exists, if not add   
    const filterHolder = JSON.parse(JSON.stringify(this.state.filter))
    const filterList = filterHolder.map((filter, i) => {
      if (type === 'select') {
        //check if same field
        if (filter.field === newFilter.field) {
          //check if value already exists
          const valuesMatchIndex = filter.values.indexOf(newFilter.values[0])
          isNew = (valuesMatchIndex === -1)
          let newValues = [...filter.values]

          if (isNew && !newFilter.remove) {
            newValues.push(newFilter.values[0])
            isNew = false
          }

          if (newFilter.remove) {
            newValues.splice(valuesMatchIndex, 1)
          }
          //check if all values from filter avlues have been killed to parent filter from list

          if (newValues.length === 0) {
            matchIndex = i
          }

          filter.values = newValues
        }
        return filter

      } else {
        //check if filter already exists
        if (filter.field === newFilter.field && filter.comparison === newFilter.comparison) {
          isNew = false;
          matchIndex = i
          //if exists - replace with new filter value
          return newFilter
        } else {
          return filter
        }
      }
    })

    if (isNew && !newFilter.remove) {
      filterList.push(newFilter)
    }

    if (newFilter.remove && matchIndex !== -1) {
      filterList.splice(matchIndex, 1)
    }

    this.setState({ filter: filterList })

  }

  setSort(newSort) {

    // ONLY ALLOW ONE SORT  - 
    if (newSort.remove) {
      this.setState({ sort: [] })
    } else {
      this.setState({ sort: [newSort] })
    }    

    // let isNew = true;
    // let matchIndex = -1
    // let sortList = this.state.sort.map((sortEntry, i) => {
    //   console.log({ ...sortEntry, ...newSort })
    //   if (_.isEqual({ ...sortEntry, ...newSort }, newSort) || _.isEqual({ ...sortEntry, ...newSort }, sortEntry)) {
    //     isNew = false
    //     matchIndex = i
    //     return newSort
    //   } else {
    //     return sortEntry
    //   }
    // })
    // if (isNew && !newSort.remove) {
    //   sortList.push(newSort)
    // }
    // if (newSort.remove) {
    //   sortList.splice(matchIndex, 1)
    // }
    // this.setState({ sort: sortList })
  }

  hideBanner = () => {
    this.setState({ banner: { ...this.state.banner, show: false } })
  }

  //LIFECYCLE METHODS

  async componentDidMount() {
    //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    // console.log("CURRENT SEARCH------", this.state.search)
    // console.log("CURRENT SEARCH SUGGESTION------", this.state.isSuggestionSet)

    await this.getProducts()
  }


  //HANDLE ANY CHANGES IN SEARCH, FILTER OR STATE BY REPULLING PRODUCTLIST
  async componentDidUpdate(prevProps, prevState) {

    // console.log('COMPONENT DID UPDATE')
    // console.log(prevState.filter)
    // console.log(this.state.filter)

    if (!_.isEqual([prevState.search, prevState.initialFilter, prevState.filter, prevState.sort],
      [this.state.search, this.state.initialFilter, this.state.filter, this.state.sort])) {
      await this.getProducts()
    }
  }

  bannerAction = (action, actionParam) => {
    // console.log('RUNNING ACTION PARAM')
    // console.log(action)
    switch (action) {
        case 'clearFilter':    
            // console.log('RUNNING ACTION CLEAR FILTER')        
          this.clearFilter()
    }
}


  getProducts = async () => {

    // console.log("RUNING GET PRODUCTS")

    this.setState({ loading: true })
    try {
      // console.log('STARTING API')
      const productList = await getProducts(this.state)
      this.setState({
        loading: false,
        productList: productList.products,
        numPages: productList.nbPages,
        currentPage: 0
      })
      // console.log('FINSIHED SETTING STATE')
    }
    catch (error) {
      this.setState({
        isError: true,
        loading: false,
        banner: { show: true, type: 'error', message: 'Error loading products. Tap here to refresh.' , 
                  action: 'clearFilter',
                  actionParam: {},
                  duration: 10000
                },               
      })
      // console.log(error)
    }
  }
  //   <SearchableList list={this.state.itemList} liFstType={"PlusMinusList"} navigation={this.props.navigation}/>
  render() {

    // fakeCart({account:this.props.account});

    const { productList, numPages } = this.state
    let numItems = (productList.length * numPages >= 900) ? '1000+' : (productList.length * numPages).toString()
    // throw 500
    return (      
      <View style={{ flex: 1, backgroundColor: colors.background.light, paddingTop: 20 }}>
 
          <>
            <Banner banner={this.state.banner} hideBanner={this.hideBanner} bannerAction={this.bannerAction} />
            <View style={[commonStyles.container, { paddingTop: 0 }]} >
              {/* <SwitchMode setMode={this.setMode} mode={this.state.title} /> */}
              {/* <Text>{this.state.title}</Text> */}
         
              <Search setSearch={this.setSearch} setSuggestion={this.setSuggestion} account={this.props.account} filter={[...this.state.initialFilter,...this.state.filter]} />
         
              {/* <View style={this.state.search && {paddingHorizontal:15,paddingVertical:15}}>
            <Text style={commonStyles.lightHeading}>{this.state.search}</Text>
          </View> */}
              {
                !this.state.isSuggestionSet &&
                <>
                  <View style={[commonStyles.row, { justifyContent: 'space-between', paddingBottom: 10, paddingHorizontal: 5 }]}>
                    <Text style={commonStyles.lightText}>{numItems} Items</Text>
                   {/*
                    <TouchableOpacity onPress={() => this.toggleFilterModal(true)}>
                      <Text style={{ color: colors.blue.primary, fontSize: sizes.s15, fontFamily: 'regular', alignSelf: 'flex-end' }}>Filter & Sort</Text>
                    </TouchableOpacity>
                   */}
                  </View>                  
                    <View>
                      <FilterModal
                        visible={this.toggleFilterModal}
                        close={this.toggleFilterModal}
                        showModal={this.state.showFilter}
                        sort={this.state.sort}
                        filter={this.state.filter}
                        setFilter={this.setFilter}
                        setSort={this.setSort}
                        clearFilter={this.clearFilter}
                        productList={this.state.productList}
                        search={this.state.search}
                        displaySuppliers={this.props.account.displaySuppliers}
                      />
                    </View>
                  

                  {this.state.loading ? <ActivityIndicator size="small" color={colors.blue.primary} style={{ alignSelf: 'center', marginTop: 70 }} /> :
                    this.state.productList.length > 0 ?
                      <ProductList
                        navigation={this.props.navigation}
                        productList={this.state.productList}
                        paddingBottom={100}
                      />
                      :
                      <View style={{ paddingTop: 50, alignItems: 'center', justifyContent: 'center',paddingHorizontal:20 }}>
                        <Text style={[commonStyles.lightText, { textAlign: 'center' }]}>No results for that search. Please try a different search or filter.</Text>
                        {
                          false &&
                         
                          <AppButton text="Shop Full Catalog" style={{ width:'100%',}} textStyle={{ fontSize: sizes.s13 }} onPress={() => this.setMode('Catalog')} />
                        }

                        {/*{
                          this.state.search  !== '' &&
                          <AppButton text="Clear Search" style={{ width:'100%',marginTop:0}} textStyle={{ fontSize: sizes.s13 }} onPress={() => this.setSearch('')} />
                        }*/}
                        
                        {
                          this.state.filter.length > 0 &&
                          <AppButton text="Clear Filters" style={{ width:'100%',marginTop:0}} textStyle={{ fontSize: sizes.s13 }} onPress={() => this.setState({filter: []})} />
                        }


                        
                      </View>
                  }
                </>
                // :<></>
              }
            </View>
          </>
        
      </View>

    )
  }
}

const mapStateToProps = state => ({
  account: state.accountState.account
})

export default connect(mapStateToProps)(OrderScreen)

  // export default MyListScreen
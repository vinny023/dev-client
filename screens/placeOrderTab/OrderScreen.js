import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { View, Text, Button, ScrollView, TouchableOpacity, ActivityIndicator, BackHandler, ToastAndroid } from 'react-native';
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
        this.state.initialFilter = [{ 'field': 'sku', 'comparison': ':', 'values': this.props.account.orderGuide }]
        this.state.title = 'Order Guide'
      } else if (this.props.initialState === 'fullCatalog') {
        this.state.title = 'Browse Full Catalog'
      }
    }
    //DEFAULT TO CATALOG - ****SWITCH BACK******
    else {
      this.state.initialFilter = [{ 'field': 'sku', 'comparison': ':', 'values': this.props.account.orderGuide }]
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
    // this.setProductList = this.setProductList.bind(this)
  }


  //HELPER METHODS

  setMode(newMode) {
    if (newMode === 'Order Guide') {
      this.setState({
        initialFilter: [{ 'field': 'sku', 'comparison': ':', 'values': this.props.account.orderGuide }],
        title: 'Order Guide'
      })
    } else if (newMode === 'Catalog') {
      this.setState({
        initialFilter: [],
        title: 'Browse Full Catalog'
      })
    }
  }

  toggleFilterModal(showBool) {
    this.setState({ showFilter: showBool })
  }

  setSearch(term) {
    this.setState({ search: term })
    this.setState({isSuggestionSet:false})

  }
  setSuggestion(val) {
      this.setState({ isSuggestionSet: val })
    
  }

  setFilter(newFilter) {
    //handle Remove    
    let type = 'qty'
    if (newFilter.field === 'supplierDisplayName' || newFilter.field === 'units') {
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

    //ONLY ALLOW ONE SORT  - this.setState({sort: [newSort]})

    let isNew = true;
    let matchIndex = -1
    let sortList = this.state.sort.map((sortEntry, i) => {
      console.log({ ...sortEntry, ...newSort })
      if (_.isEqual({ ...sortEntry, ...newSort }, newSort) || _.isEqual({ ...sortEntry, ...newSort }, sortEntry)) {
        isNew = false
        matchIndex = i
        return newSort
      } else {
        return sortEntry
      }
    })
    if (isNew && !newSort.remove) {
      sortList.push(newSort)
    }
    if (newSort.remove) {
      sortList.splice(matchIndex, 1)
    }
    this.setState({ sort: sortList })
  }

  hideBanner = () => {
    this.setState({ banner: { ...this.state.banner, show: false } })
  }

  //LIFECYCLE METHODS

  async componentDidMount() {
    //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    console.log("CURRENT SEARCH------",this.state.search)
    console.log("CURRENT SEARCH SUGGESTION------",this.state.isSuggestionSet)
    
    await this.getProducts()
  }


  //HANDLE ANY CHANGES IN SEARCH, FILTER OR STATE BY REPULLING PRODUCTLIST
  async componentDidUpdate(prevProps, prevState) {

    console.log('COMPONENT DID UPDATE')
    console.log(prevState.filter)
    console.log(this.state.filter)

    if (!_.isEqual([prevState.search, prevState.initialFilter, prevState.filter, prevState.sort],
      [this.state.search, this.state.initialFilter, this.state.filter, this.state.sort])) {
      await this.getProducts()
    }
  }


  getProducts = async () => {

    console.log("RUNING GET PRODUCTS")

    this.setState({ loading: true })
    try {
      console.log('STARTING API')
      const productList = await getProducts(this.state)
      this.setState({
        loading: false,
        productList: productList.products,
        numPages: productList.nbPages,
        currentPage: 0
      })
      console.log('FINSIHED SETTING STATE')
    }
    catch (error) {
      this.setState({
        isError: true,
        loading: false,
        banner: { show: true, type: 'error', message: 'Error Loading Products - please try searching or switching lists' },
      })
      console.log(error)
    }
  }
  //   <SearchableList list={this.state.itemList} listType={"PlusMinusList"} navigation={this.props.navigation}/>
  render() {

    const { productList, numPages } = this.state
    let numItems = (productList.length * numPages >= 900) ? '1000+' : (productList.length * numPages).toString()

    return (
      <View style={{ flex: 1, backgroundColor: colors.background.primary, paddingTop: 20 }}>
        <Banner banner={this.state.banner} hideBanner={this.hideBanner} />
        <ScrollView style={[commonStyles.container, { paddingTop: 0 }]} >
          <SwitchMode setMode={this.setMode} mode={this.state.title} />
          {/* <Text>{this.state.title}</Text> */}
          <Search setSearch={this.setSearch} setSuggestion={this.setSuggestion} account={this.props.account} />
          {/* <View style={this.state.search && {paddingHorizontal:15,paddingVertical:15}}>
            <Text style={commonStyles.lightHeading}>{this.state.search}</Text>
          </View> */}
          {
            !this.state.isSuggestionSet &&
            <>
              <View style={[commonStyles.row, { justifyContent: 'space-between', paddingBottom: 10, paddingHorizontal: 5 }]}>
                <Text style={commonStyles.lightText}>{numItems} Items</Text>
                <TouchableOpacity onPress={() => this.toggleFilterModal(true)}>
                  <Text style={{ color: colors.blue.primary, fontSize: sizes.s15, fontFamily: 'regular', alignSelf: 'flex-end' }}>Filter & Sort</Text>
                </TouchableOpacity>
              </View>
              {this.state.showFilter &&
                <View>
                  <FilterModal
                    visible={this.toggleFilterModal}
                    close={this.toggleFilterModal}
                    sort={this.state.sort}
                    filter={this.state.filter}
                    setFilter={this.setFilter}
                    setSort={this.setSort}
                    productList={this.state.productList}
                  />
                </View>
              }
              {/* 
<Text>SORT</Text>
<Text>{JSON.stringify(this.state.sort)}</Text>
<Text>FILTER</Text>
<Text>{JSON.stringify(this.state.filter)}</Text> */}
          {this.state.loading ? <ActivityIndicator size="small" color={colors.blue.primary} style={{ alignSelf: 'center', marginTop: 70 }} /> :
             this.state.productList.length>0?
           <View style={{ padding: 10, backgroundColor: colors.white, borderRadius: 10, marginBottom: 10 }}>
                <ProductList
                  navigation={this.props.navigation}
                  productList={this.state.productList}
                />
              </View>
            :
            <View style={{ padding: 50, alignItems: 'center', justifyContent: 'center', }}>
                <Text style={[commonStyles.lightText, { textAlign: 'center' }]}>No items for that search. Please try a different search or filter.</Text>
                {
                  this.state.title == 'Order Guide' &&
                  <AppButton text="Shop Full Catalog" style={{ paddingHorizontal: 20 }} onPress={() => this.setState({ title: 'Browse Full Catalog' })} />
                }
              </View>
  }
            </>
           // :<></>
          }
        </ScrollView>
      </View>

    )
  }
}

const mapStateToProps = state => ({
  account: state.accountState.account
})

export default connect(mapStateToProps)(OrderScreen)

  // export default MyListScreen
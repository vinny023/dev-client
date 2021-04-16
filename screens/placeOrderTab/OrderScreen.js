import React from 'react';
// import { Layout, Text } from '@ui-kitten/components';
import { View, Text, Button, ScrollView} from 'react-native';
import {connect} from 'react-redux'
import SwitchMode from '../../components/OrderScreen/SwitchMode'
import FilterModal from '../../components/OrderScreen/FilterModal'
import Search from '../../components/OrderScreen/Search'
import ProductListItem from '../../components/Global/ProductListItem'
import ProductList from '../../components/Global/ProductList'
// import CartButton from '../../components/Global/CartButton'
import {getProducts} from '../../apis/apis'
import _ from 'lodash' 

export class OrderScreen extends React.Component {  

    constructor(props) {
      super(props);

      this.state = {
        search: '',
        initialFilter: [],
        filter:  [],
        sort: [],
        title: '',
        availableFilters: [],
        // showSearchSuggestions: false,
        showFilter: false,  
        productList: [],
        loading: true,   
        accountId: this.props.account.id,
        isError: false   
      }

      //HANDLE STATE INITIALIZATION     
      if (this.props.initialState) {
        if (this.props.initialState === 'orderGuide') {
          this.state.initialFilter = [{'field':'sku', 'comparison':':', 'values':this.props.account.orderGuide}]
          this.state.title = 'Order Guide'         
        } else if (this.props.initialState === 'fullCatalog') {
          this.state.title = 'Browse Full Catalog'
        }        
      } 
      //DEFAULT TO CATALOG - ****SWITCH BACK******
      else {
        this.state.initialFilter = [{'field':'sku', 'comparison':':', 'values':this.props.account.orderGuide}]
        this.state.title = 'Order Guide'    
        // this.state.title = 'Browse Full Catalog'     
      }    

      //SET CUSTOM PROPS IF PROPS ARE VALID
      const {propTitle, propFilter, propSort, propSearch} = this.props
      if (propTitle) {this.state.title = propTitle}
      if (propFilter) {this.state.filter = [...this.state.filter, ...propFitler]}
      if (propSort) {this.state.filter = [...this.state.filter, ...propSort]}
      if (propSearch) {this.state.search = propSearch}

      //BIND FUNCTIONS TO PASS STATE UP
      this.setMode = this.setMode.bind(this)
      this.toggleFilterModal = this.toggleFilterModal.bind(this)
      this.setSearch = this.setSearch.bind(this)
      this.setSort = this.setSort.bind(this)
      this.setFilter = this.setFilter.bind(this)
      // this.setProductList = this.setProductList.bind(this)
      }     
          
   setMode(newMode) {
      if (newMode === 'Order Guide') {
        this.setState({
          initialFilter: [{'field':'sku', 'comparison':':', 'values':this.props.account.orderGuide}],
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
      this.setState({showFilter: showBool})
    }

    setSearch(term) {
      this.setState({search: term})
    }

    setFilter(newFilter) {
          //handle Remove
      console.log(newFilter)
      let type = 'qty'
      if (newFilter.field === 'supplierDisplayName' || newFilter.field === 'units') {
          type = 'select'
          newFilter.values = [newFilter.value]
          delete newFilter.value
      }
      
      let isNew = true;
      let matchIndex = -1

      //check if filter already exists, if not add                      
      const filterList = this.state.filter.map((filter, i) => {
        if (type === 'select') {
            //check if same field
            if (filter.field === newFilter.field ) {
              //check if value already exists
              const valuesMatchIndex = filter.values.indexOf(newFilter.values[0])
              isNew = (valuesMatchIndex === -1)              
              let newValues = [...filter.values]             
         
              if (isNew && !newSort.remove) {
                newValues.push(newFilter.values[0])
                isNew = false
              }

              if (newFilter.remove) {
                newValues.splice(valuesMatchIndex,1)
              }
              //check if all values from filter avlues have been killed to parent filter from list
          
              if (newValues.length === 0 ) {
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
     
     this.setState({filter: filterList})
    
    }
    
    setSort(newSort) {      
      let isNew = true;
      let matchIndex = -1
      let sortList = this.state.sort.map((sortEntry,i) => {
        console.log({...sortEntry,...newSort})
          if (_.isEqual({...sortEntry, ...newSort},newSort) || _.isEqual({...sortEntry, ...newSort},sortEntry)) {
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
          sortList.splice(matchIndex,1)
      }
      this.setState({sort: sortList})          
    }   
    
    async componentDidMount() {      
      try {          
        this.setState({
            loading: false,
            productList: await getProducts(this.state)
        })             
      }  
      
      catch (error) {
        this.setState({isError:true})
        console.log(error)
      }   
    }

    async componentDidUpdate(prevProps, prevState) {     
      if (!_.isEqual([prevState.search, prevState.initialFilter, prevState.filter, prevState.sort], 
            [this.state.search, this.state.initialFilter, this.state.filter, this.state.sort])) {
        this.setState({ loading: true })
      try {    
        console.log('STARTING API')      
        this.setState({
            loading: false,
            productList: await getProducts(this.state)
        })
        console.log('FINSIHED SETTING STATE')    
      }      
      catch (error) {
        this.setState({isError:true})
        console.log(error)
      }   
      }
    }

    //   <SearchableList list={this.state.itemList} listType={"PlusMinusList"} navigation={this.props.navigation}/>
    render() {
      return(
        <View>
        
          <SwitchMode setMode={this.setMode}/>
          <Text>{this.state.title}</Text>        
          <Search setSearch={this.setSearch} account={this.props.account}/> 
          <Text>{this.state.search}</Text>         
          <Button onPress={() => this.toggleFilterModal(true)} title="Filter & Sort" />
          {this.state.showFilter && 
            <ScrollView>
            <FilterModal 
              close={this.toggleFilterModal} 
              sort={this.state.sort}
              filter={this.state.filter} 
              setFilter={this.setFilter} 
              setSort={this.setSort}
              productList={this.state.productList}
            />
            </ScrollView>
            }
            
            <Text>SORT</Text>
            <Text>{JSON.stringify(this.state.sort)}</Text>
            <Text>FILTER</Text>
            <Text>{JSON.stringify(this.state.filter)}</Text>            
            {this.state.loading ? <Text>Loading...</Text> : 
              <ProductList
                navigation={this.props.navigation}
                productList={this.state.productList}                
              /> }                            
        </View>
      )
    }
  } 
  
  const mapStateToProps = state => ( {
    account: state.accountState.account    
  })

  export default connect(mapStateToProps)( OrderScreen)

  // export default MyListScreen
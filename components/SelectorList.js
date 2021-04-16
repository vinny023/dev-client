import React from 'react'

import SelectorListItem from './SelectorListItem'

export default function SelectorList( {navigation, screen, list, type}) {

    return (
        list.map(listItem => {
          return  <SelectorListItem navigation={navigation} screen={screen} item={listItem}/>
        })    
    )

}
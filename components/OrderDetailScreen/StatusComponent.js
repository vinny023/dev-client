import React from 'react'
import { View, Text,StyleSheet } from 'react-native'
import { colors, commonStyles, sizes } from '../../theme'

export default function StatusComponent({status,placeDate,confirmDate,deliverDate}) {
    return (
        <View style={[commonStyles.row,{ marginHorizontal: 10,marginTop:5 }]}>
            <View>
                <View style={[styles.line,{backgroundColor:colors.blue.primary}]} />
                <Text style={[styles.text,{fontSize:sizes.s15}]}>Placed</Text>
                <Text style={styles.text}>{placeDate}</Text>
            </View>
            <View>
                <View style={[styles.line,{backgroundColor:status!=='Placed'?colors.blue.primary:colors.background.primary}]} />
                <Text style={[styles.text,{fontSize:sizes.s15,color:status!=="Placed"?colors.text:colors.grey.light}]}>Confirmed</Text>
                <Text style={[styles.text,{color:status!=="Placed"?colors.text:colors.grey.light}]}>{confirmDate}</Text>
            </View>
            <View>
                <View style={[styles.line,{backgroundColor:status==='Delivered'?colors.blue.primary:colors.background.primary}]} />
                <Text style={[styles.text,{fontSize:sizes.s15,color:status==="Delivered"?colors.text:colors.grey.light}]}>Delivered</Text>
                <Text style={[styles.text,{color:status==="Delivered"?colors.text:colors.grey.light}]}>{deliverDate}</Text>
            </View>
        </View>
    )
}
const styles=StyleSheet.create({
 line:{
     height:4,
     width:90,
     marginBottom:10,
     marginRight:5
 },
 text:{
     fontFamily:'medium',
     //fontSize:sizes.s16,
     fontSize:sizes.s14,
     textAlign:'center'
 }
})
import { colors, sizes } from ".";

const commonStyles = {
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.background.primary,
    paddingBottom: 20
  },
  btnContainer: {
    backgroundColor: colors.blue.primary,
    alignItems: 'center',
    justifyContent: 'center',
    height: 41,
    borderRadius: 10,
    marginVertical: 20,
    elevation: 3,
    shadowColor: 'rgba(0,0,0,0.20)',
    shadowOffset: {
      width: 0,
      height: 3
    },
    //shadowRadius: 5,
    //shadowOpacity: 0.5
  },
  btnText: {
    color: colors.white,
    fontSize: sizes.s15,
     fontFamily: 'bold'
  },
  modalView: {
    width: '100%',
    height: '100%',
    marginBottom: 0,
    marginLeft: 0
  },
  centeredView: {
    backgroundColor: colors.background.light,
    flex: 1,
    paddingTop: 20,
    marginTop: 80,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  text: {
    //fontSize: sizes.s16,
    fontSize: sizes.s14,
    fontFamily: 'medium',
    color: colors.text
  },
  lightText: {
    //fontSize: sizes.s15,
    fontSize: sizes.s13,
    fontFamily: 'regular',
    color: colors.grey.primary
  },
  lightHeading: {
    //fontSize: sizes.s16,
    fontSize:sizes.s14,
    fontFamily: 'medium',
    color: colors.grey.primary
},
card: {
  backgroundColor: colors.white,
  paddingHorizontal: 15,
  paddingVertical:10,
  borderRadius: 10,
  marginTop: 7
},
bannerText:{
  //fontSize:sizes.s16,
  fontSize:sizes.s14,
  fontFamily:'bold',
 // color:colors.white,
  textAlign:'center',

},
bannerTitle:{
  fontSize:sizes.s14,
//  fontSize:sizes.s16,
  fontFamily:'regular',
 // color:colors.white,
  textAlign:'center',

}
}
export default commonStyles;
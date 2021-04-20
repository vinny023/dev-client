import { colors, sizes } from ".";

const commonStyles = {
  container: {
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: colors.background.primary,
    paddingBottom:20
  },
  btnContainer: {
    backgroundColor: colors.blue.primary,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 10,
    marginVertical: 20,
    elevation: 3
  },
  btnText: {
    color: colors.white,
    fontSize: sizes.s18,
  //  fontFamily: 'bold'
  },
  modalView: {
    backgroundColor: colors.background.light,
    flex: 1,
    paddingTop: 20,
    marginTop: 70,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
},
row: {
  flexDirection: 'row',
  alignItems: 'center',

},
text: { fontSize: sizes.s16,
  // fontFamily: 'medium',
    color: colors.text },
}
export default commonStyles;
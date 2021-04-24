import { colors, sizes } from ".";

const commonStyles = {
  container: {
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: colors.background.primary,
    paddingBottom: 20
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
    fontSize: sizes.s17,
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
    marginTop: 83,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  text: {
    fontSize: sizes.s16,
    fontFamily: 'medium',
    color: colors.text
  },
  lightText: {
    fontSize: sizes.s15,
    fontFamily: 'regular',
    color: colors.grey.primary
  },
  lightHeading: {
    fontSize: sizes.s16,
    fontFamily: 'medium',
    color: colors.grey.primary
},card: {
  backgroundColor: colors.white,
  padding: 15,
  borderRadius: 10,
  marginTop: 10
},
}
export default commonStyles;
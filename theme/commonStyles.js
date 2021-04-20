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
    fontFamily: 'bold'
  }
}
export default commonStyles;
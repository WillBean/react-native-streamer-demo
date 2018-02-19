import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  cardContainer: {
    width: 170,
    height: 225,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, .05)',
  },
  cardImg: {
    width: 170,
    height: 225,
    borderRadius: 3,
  },
  living: {
    position: 'absolute',
    right: 5,
    top: 5,
    width: 60,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(204, 204, 204, 0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: '#E7211A',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 3,
  },
  livingText: {
    color: '#E7211A',
    fontSize: 11,
  },
  cardMsgCont: {
    backgroundColor: 'rgba(204, 204, 204, 0.5)',
    width: 170,
    height: 40,
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // height: 20,
    paddingHorizontal: 5,
  },
  title: {
    color: '#040000',
    fontSize: 14,
  },
  number: {
    color: '#E7211A',
    fontSize: 16,
  },
  description: {
    color: '#4E4D4D',
    fontSize: 14,
  },
});

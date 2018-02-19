import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width,
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 65,
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 27,
    marginBottom: 1,
  },
  iconText: {
    fontSize: 10,
  },
  activeText: {
    color: '#E7211A',
  },
  playBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'relative',
    bottom: 10,
    backgroundColor: '#F2F2F2',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    width: 40,
    height: 40,
  },
});

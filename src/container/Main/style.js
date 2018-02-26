import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  pageCont: {
    flexDirection: 'row',
    flex: 1,
  },
  pageTwo: {
    transform: [{ translateX: -width }],
  },
});

import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  wrapper: {
    width,
    height,
  },
  pageCont: {
    flexDirection: 'row',
    // transform: [{ translateX: -200 }],
  },
  pageTwo: {
    transform: [{ translateX: -width }],
  },
});

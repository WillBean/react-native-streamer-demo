import { Dimensions, StyleSheet, PixelRatio } from 'react-native';
import { calculatePixel } from '../../common/util/tools';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#666',
  },
  live: {
    position: 'absolute',
    left: 0,
    top: 0,
    width,
    height,
  },
  mask: {
    position: 'absolute',
    left: 0,
    top: 0,
    width,
    height,
    // backgroundColor: 'rgba(0, 0, 0, .4)',
  },
  configureWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

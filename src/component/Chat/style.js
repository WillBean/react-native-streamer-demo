import { StyleSheet, Dimensions } from 'react-native';
import { calculatePixel } from '../../common/util/tools';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    width,
    height: calculatePixel(40),
    position: 'absolute',
    left: 0,
    bottom: calculatePixel(15),
    paddingHorizontal: calculatePixel(15),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  chatImg: {
    width: calculatePixel(24),
    height: calculatePixel(24),
    marginRight: calculatePixel(10),
  },
  chatInput: {
    height: calculatePixel(30),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.05)',
    color: '#fff',
    fontSize: calculatePixel(11),
    borderRadius: calculatePixel(15),
    paddingHorizontal: calculatePixel(15),
  },
});

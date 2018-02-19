import { StyleSheet, Dimensions } from 'react-native';
import { calculatePixel } from '../../common/util/tools';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  page: {
    width,
  },
  accountMsg: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: calculatePixel(300),
  },
  avatarCont: {
    width: calculatePixel(100),
    height: calculatePixel(100),
    backgroundColor: '#fff',
    borderRadius: calculatePixel(50),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: calculatePixel(90),
    height: calculatePixel(90),
    borderRadius: calculatePixel(40),
  },
});

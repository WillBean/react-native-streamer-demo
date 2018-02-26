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
  name: {
    color: '#fff',
    fontSize: calculatePixel(16),
    marginTop: calculatePixel(10),
    marginBottom: calculatePixel(5),
  },
  descCont: {
    position: 'relative',
    width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: calculatePixel(14),
    color: '#fff',
    width: calculatePixel(250),
    textAlignVertical: 'top',
    textAlign: 'center',
  },
  enable: {
    position: 'absolute',
    top: -calculatePixel(5),
    height: calculatePixel(20),
    width: calculatePixel(20),
  },
});

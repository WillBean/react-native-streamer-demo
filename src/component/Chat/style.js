import { StyleSheet } from 'react-native';
import { calculatePixel } from '../../common/util/tools';

export default StyleSheet.create({
  container: {
    height: calculatePixel(40),
    marginVertical: calculatePixel(15),
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
    paddingVertical: 0,
  },
});

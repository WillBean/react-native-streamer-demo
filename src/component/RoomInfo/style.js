import { StyleSheet, Dimensions } from 'react-native';
import { calculatePixel } from '../../common/util/tools';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    width,
    position: 'absolute',
    left: 0,
    top: calculatePixel(20),
    paddingHorizontal: calculatePixel(15),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: calculatePixel(10),
  },
  anchorCont: {
    flexDirection: 'row',
    // alignItems: 'center',
  },
  avatar: {
    width: calculatePixel(40),
    height: calculatePixel(40),
    borderRadius: calculatePixel(20),
    marginRight: calculatePixel(5),
  },
  anchorMsg: {
    width: calculatePixel(140),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  anchorName: {
    color: '#ddd',
    fontSize: calculatePixel(11),
  },
  anchorDesc: {
    color: '#fff',
    fontSize: calculatePixel(10),
  },
  infoCont: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  infoText: {
    color: '#fff',
    fontSize: calculatePixel(10),
  },
  number: {
    color: 'rgba(230,29,114,1)',
  },
  closeBtn: {
    width: calculatePixel(20),
    height: calculatePixel(20),
    marginBottom: calculatePixel(5),
  },
});

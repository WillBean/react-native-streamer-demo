import { StyleSheet, Dimensions } from 'react-native';
import { calculatePixel } from '../../common/util/tools';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  toolBarCont: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: calculatePixel(65),
    paddingTop: calculatePixel(20),
    // paddingHorizontal: calculatePixel(10),
  },
  iconBtn: {
    width: calculatePixel(20),
    height: calculatePixel(20),
    marginHorizontal: calculatePixel(15),
  },
  btToolCont: {
    width: width - calculatePixel(30),
    // height: calculatePixel(100),
    borderRadius: calculatePixel(5),
    position: 'absolute',
    opacity: 0,
    top: 0,
    left: calculatePixel(15),
    backgroundColor: 'rgba(0, 0, 0, .2)',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: calculatePixel(5),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: calculatePixel(5),
    flex: 1,
  },
  btText: {
    color: '#fff',
    fontSize: 14,
    marginRight: calculatePixel(3),
  },
  btSlider: {
    flex: 1,
  },
  resetBeautify: {
    fontSize: 14,
    color: 'rgba(230,29,114,1)',
  },
  audioPicker: {
    flex: 1,
    // height: calculatePixel(80),
  },
  colorWhite: {
    color: '#fff',
  },
});

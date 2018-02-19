import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { calculatePixel } from '../../common/util/tools';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    width,
    height,
  },
  tabBar: {
    paddingTop: 20,
    height: calculatePixel(65),
    paddingHorizontal: calculatePixel(20),
    paddingBottom: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: calculatePixel(3),
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
  },
  textCont: {
    height: height - calculatePixel(185),
    paddingHorizontal: calculatePixel(20),
    paddingVertical: calculatePixel(10),
  },
  description: {
    fontSize: calculatePixel(16),
    height: calculatePixel(60),
  },
  previewCont: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1 / PixelRatio.get(0),
    paddingVertical: calculatePixel(15),
  },
  previewImg: {
    width: calculatePixel(170),
    height: calculatePixel(225),
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, .05)',
  },
  bottomCont: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: calculatePixel(120),
  },
  playBtn: {
    width: calculatePixel(66),
    height: calculatePixel(66),
    borderRadius: calculatePixel(33),
  },
});

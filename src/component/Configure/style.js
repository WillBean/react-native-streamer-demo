import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { calculatePixel } from '../../common/util/tools';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  configureCont: {
    paddingHorizontal: calculatePixel(15),
    paddingBottom: calculatePixel(15),
    // position: 'absolute',
    // left: 0,
    // bottom: 0,
    // width,
  },
  configure: {
    flexDirection: 'row',
  },
  previewCont: {
    width: calculatePixel(100),
    paddingBottom: calculatePixel(10),
  },
  previewBtn: {
    width: calculatePixel(90),
    height: calculatePixel(90),
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, .05)',
  },
  tip: {
    height: calculatePixel(15),
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: calculatePixel(90),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipWithBg: {
    backgroundColor: 'rgba(0, 0, 0, .6)',
  },
  tipText: {
    color: '#fff',
    fontSize: 10,
  },
  uploadCont: {
    width: calculatePixel(90),
    height: calculatePixel(90),
    borderRadius: 3,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderBottomWidth: 1 / PixelRatio.get(0),
    borderTopWidth: 1 / PixelRatio.get(0),
    borderLeftWidth: 1 / PixelRatio.get(0),
    borderRightWidth: 1 / PixelRatio.get(0),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cross: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '100',
  },
  textCont: {
    bottom: calculatePixel(10),
  },
  uploadText: {
    color: '#fff',
    fontSize: 12,
  },
  description: {
    fontSize: calculatePixel(16),
    height: calculatePixel(90),
    paddingBottom: calculatePixel(10),
    flex: 1,
    color: '#fff',
  },
  control: {
    borderTopColor: '#666',
    borderTopWidth: 1 / PixelRatio.get(0),
    paddingTop: calculatePixel(15),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  playBtn: {
    width: calculatePixel(100),
    height: calculatePixel(32),
    borderRadius: calculatePixel(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    color: '#fff',
    fontSize: calculatePixel(14),
  },
});

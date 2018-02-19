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
    backgroundColor: 'rgba(0, 0, 0, .4)',
  },
  configureCont: {
    paddingHorizontal: calculatePixel(15),
    paddingBottom: calculatePixel(15),
    position: 'absolute',
    left: 0,
    // bottom: 0,
    width,
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
    // borderBottomColor: '#666',
    // borderBottomWidth: 1 / PixelRatio.get(0),
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
  toolBarCont: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width,
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

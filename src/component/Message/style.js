import { StyleSheet } from 'react-native';
import { calculatePixel } from '../../common/util/tools';

export default StyleSheet.create({
  container: {
    marginVertical: calculatePixel(15),
    marginHorizontal: calculatePixel(15),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    height: calculatePixel(200),
  },
  msgView: {
    height: calculatePixel(200),
  },
  msgItem: {
    flexDirection: 'row',
    overflow: 'hidden',
    opacity: 0.8,
  },
  msgItemOuter: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: calculatePixel(3),
    borderRadius: calculatePixel(15),
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: calculatePixel(5),
    paddingRight: calculatePixel(15),
    marginVertical: calculatePixel(5),
  },
  avatar: {
    width: calculatePixel(24),
    height: calculatePixel(24),
    maxHeight: calculatePixel(24),
    borderRadius: calculatePixel(12),
    marginRight: calculatePixel(5),
  },
  msgBox: {
    maxWidth: calculatePixel(290),
  },
  name: {
    paddingTop: calculatePixel(3),
    fontSize: calculatePixel(8),
    color: '#454545',
  },
  systemText: {
    color: '#333',
    fontSize: calculatePixel(8),
  },
  msgText: {
    color: '#333',
    fontSize: calculatePixel(8),
    paddingBottom: calculatePixel(3),
  },
});

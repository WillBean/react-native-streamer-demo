import { StyleSheet } from 'react-native';
import { calculatePixel } from '../../common/util/tools';

export default StyleSheet.create({
  accountCont: {
    flex: 1,
  },
  animateCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: calculatePixel(100),
    height: calculatePixel(100),
    borderRadius: calculatePixel(15),
    marginBottom: calculatePixel(65),
  },
  outer: {
    width: calculatePixel(300),
    height: calculatePixel(55),
    paddingHorizontal: calculatePixel(20),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: calculatePixel(15),
    backgroundColor: 'rgba(255,255,255,.5)',
    borderRadius: calculatePixel(10),
  },
  icon: {
    width: calculatePixel(18),
    height: calculatePixel(18),
    marginRight: calculatePixel(15),
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: calculatePixel(17),
  },
  login: {
    width: calculatePixel(200),
    height: calculatePixel(50),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: calculatePixel(30),
    marginTop: calculatePixel(15),
    backgroundColor: '#B31650',
    borderRadius: calculatePixel(10),
  },
  loginText: {
    fontSize: calculatePixel(20),
    color: '#fff',
  },
  cancel: {
    position: 'absolute',
    right: calculatePixel(35),
    top: calculatePixel(40),
  },
  register: {
    color: '#fff',
    fontSize: calculatePixel(16),
  },
});

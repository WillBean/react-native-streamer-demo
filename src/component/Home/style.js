import { StyleSheet, Dimensions } from 'react-native';
import { calculatePixel } from '../../common/util/tools';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  page: {
    width,
  },
  tabBar: {
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: calculatePixel(3),
  },
  tabsContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  tabBtn: {
    width: 80,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollCont: {
    flex: 1,
  },
  // Banner
  swiperContainer: {
    height: calculatePixel(180),
    backgroundColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  bannerImg: {
    flex: 1,
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
    position: 'relative',
    top: 15,
  },
  activeDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
    position: 'relative',
    top: 15,
  },
  cardListCont: {
    paddingHorizontal: 10,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

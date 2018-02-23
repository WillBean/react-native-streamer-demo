import { Navigation } from 'react-native-navigation';
import registerScreens from './router';
import Provider from './common/util/MobxProvider';
import store from './store';

registerScreens(store, Provider);
Navigation.startSingleScreenApp({
  screen: {
    screen: 'Home',
    navigatorStyle: {
      navBarHidden: true,
    },
  },
  passProps: {},
  animationType: 'slide-down',
});

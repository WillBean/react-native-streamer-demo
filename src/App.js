import { Navigation } from 'react-native-navigation';
import registerScreens from './router';

registerScreens();
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

import { Navigation } from 'react-native-navigation';

import Account from '../component/Account';
import Home from '../container/Main';
import Live from '../container/Live';
import Configure from '../container/Configure';
import Video from '../container/Video';

export default function registerScreens(store: {}, Provider: {}) {
  Navigation.registerComponent('Account', () => Account, store, Provider);
  Navigation.registerComponent('Home', () => Home, store, Provider);
  Navigation.registerComponent('Live', () => Live, store, Provider);
  // Navigation.registerComponent('Configure', () => Configure, store, Provider);
  Navigation.registerComponent('Video', () => Video, store, Provider);
}

import { Navigation } from 'react-native-navigation';

import Account from '../component/Account';
import Main from '../container/Main';
import Home from '../component/Home';
import Live from '../container/Live';
import Video from '../container/Video';
import Login from '../container/Login';
import Register from '../container/Register';

export default function registerScreens(store: {}, Provider: {}) {
  Navigation.registerComponent('Account', () => Account, store, Provider);
  Navigation.registerComponent('Home', () => Home, store, Provider);
  Navigation.registerComponent('Main', () => Main, store, Provider);
  Navigation.registerComponent('Live', () => Live, store, Provider);
  Navigation.registerComponent('Login', () => Login, store, Provider);
  Navigation.registerComponent('Video', () => Video, store, Provider);
  Navigation.registerComponent('Register', () => Register, store, Provider);
}

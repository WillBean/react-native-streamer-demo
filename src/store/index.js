// import { create } from 'mobx-persist';
// import { AsyncStorage } from 'react-native';

import userState from './UserInfo';
import liveState from './Lives';
import messageState from './Message';

// const hydrate = create({ storage: AsyncStorage });

const stores = {
  userState,
  liveState,
  messageState,
};

export default {
  ...stores,
};

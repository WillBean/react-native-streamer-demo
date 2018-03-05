import React, { Component } from 'react';
import {
  Alert,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Nav from '../../component/Nav';
import Home from '../../component/Home';
import Account from '../../component/Account';
import style from './style';

@inject('userState')
@observer
export default class Main extends Component<{}> {
  static propTypes = {
    navigator: PropTypes.object,
    userState: PropTypes.shape({
      username: PropTypes.string,
      accessToken: PropTypes.string,
    }),
  };

  static defaultProps = {
    navigator: {},
    userState: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      activeNav: 'Home',
    };
  }

  handleNavClick(type) {
    if (type === 'Home' || type === 'Account') {
      this.setState({ activeNav: type });
    } else if (type === 'Play') {
      const { username, accessToken } = this.props.userState;
      if (!username || !accessToken) {
        Alert.alert('出错啦', '抱歉，您要登录之后才能直播哦~', [
          { text: '确定', onPress: () => {} },
        ]);
        return;
      }

      const { navigator } = this.props;
      navigator.showModal({
        screen: 'Live',
        navigatorStyle: {
          navBarHidden: true,
        },
      });
    }
  }

  render() {
    const { navigator } = this.props;
    const { activeNav } = this.state;
    const isAccount = activeNav === 'Account';
    const transformCls = isAccount ? style.pageTwo : null;

    return (
      <View style={style.wrapper}>
        <View style={[style.pageCont]}>
          <Home containerStyle={transformCls} navigator={navigator} />
          <Account containerStyle={transformCls} navigator={navigator} />
        </View>
        <Nav
          active={activeNav}
          onClick={this.handleNavClick.bind(this)}
        />
      </View>
    );
  }
}

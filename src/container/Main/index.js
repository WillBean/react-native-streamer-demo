import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Nav from '../../component/Nav';
import Home from '../../component/Home';
import Account from '../../component/Account';
import style from './style';

export default class Main extends Component<{}> {
  static propTypes = {
    navigator: PropTypes.object,
  };

  static defaultProps = {
    navigator: {},
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
        <View style={[style.pageCont, transformCls]}>
          <Home navigator={navigator} />
          <Account />
        </View>
        <Nav
          active={activeNav}
          onClick={this.handleNavClick.bind(this)}
        />
      </View>
    );
  }
}

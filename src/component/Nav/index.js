import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { PropTypes } from 'prop-types';

import style from './style';
import homeImg from '../../images/home.png';
import homeActiveImg from '../../images/home-active.png';
import accountImg from '../../images/account.png';
import accountActiveImg from '../../images/account-active.png';
import playImg from '../../images/play.png';

export default class Nav extends Component<{}> {
  static propTypes = {
    active: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  handleClick(type) {
    const { onClick, active } = this.props;
    if (active !== type) {
      onClick(type);
    }
  }

  render() {
    const { active } = this.props;
    const isHome = active === 'Home';
    const isAccount = active === 'Account';

    return (
      <View style={style.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={style.button}
          onPress={this.handleClick.bind(this, 'Home')}
        >
          <Image
            style={style.icon}
            source={!isHome ? homeImg : homeActiveImg}
          />
          <Text style={[style.iconText, isHome ? style.activeText : null]}>首页</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={style.playBtn}
          onPress={this.handleClick.bind(this, 'Play')}
        >
          <Image
            style={style.playIcon}
            source={playImg}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={style.button}
          onPress={this.handleClick.bind(this, 'Account')}
        >
          <Image
            style={style.icon}
            source={!isAccount ? accountImg : accountActiveImg}
          />
          <Text style={[style.iconText, isAccount ? style.activeText : null]}>我的</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

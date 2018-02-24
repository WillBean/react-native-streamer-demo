import React, { Component } from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import style from './style';
import closeImg from '../../images/close.png';
import avatarImg from '../../images/img.png';

export default class Account extends Component<{}> {
  static propTypes = {
    number: PropTypes.number.isRequired,
    anchor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };

  renderAnchor() {
    const { anchor, description } = this.props;
    return (
      <View style={style.anchorCont}>
        <Image
          resizeMode="cover"
          source={avatarImg}
          style={style.avatar}
        />
        <View style={style.anchorMsg}>
          <Text style={style.anchorName} numberOfLines={1}>{anchor}</Text>
          <Text style={style.anchorDesc} numberOfLines={3}>{description}</Text>
        </View>
      </View>
    );
  }

  render() {
    const { number } = this.props;
    return (
      <View style={style.container}>
        {this.renderAnchor()}
        <View style={style.infoCont}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Image
              source={closeImg}
              style={style.closeBtn}
            />
          </TouchableOpacity>
          <Text style={style.infoText}><Text style={style.number}>{number}</Text>人正在观看直播</Text>
        </View>
      </View>
    );
  }
}

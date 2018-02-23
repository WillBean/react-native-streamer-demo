import React, { Component } from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

import style from './style';
import closeImg from '../../images/close.png';
import avatarImg from '../../images/img.png';

export default class Account extends Component<{}> {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  renderAnchor() {
    return (
      <View style={style.anchorCont}>
        <Image
          resizeMode="cover"
          source={avatarImg}
          style={style.avatar}
        />
        <View style={style.anchorMsg}>
          <Text style={style.anchorName} numberOfLines={1}>GKKI</Text>
          <Text style={style.anchorDesc} numberOfLines={3}>啊哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</Text>
        </View>
      </View>
    );
  }

  render() {

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
          <Text style={style.infoText}><Text style={style.number}>12345</Text>人正在观看直播</Text>
        </View>
      </View>
    );
  }
}

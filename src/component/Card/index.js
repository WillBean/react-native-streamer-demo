import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';

import style from './style';
import img from '../../images/img.png';

function formatNumber(num) {
  if (num > 10000) {
    return `${(num / 10000).toFixed(1)}万人`;
  }
  return num;
}

export default class Card extends Component<{}> {
  // static propsType = {
  //   card: PropTypes.object.isRequired,
  // }

  render() {
    // const { card } = this.props;
    const card = {
      img: '',
      liveId: '',
      title: 'GAKKI',
      description: '啊哈哈哈哈',
      number: 12000,
    };
    return (
      <TouchableHighlight
        style={style.cardContainer}
        onPress={() => {
          console.log(111222);
        }}
      >
        <View>
          <Image
            style={style.cardImg}
            resizeMode="cover"
            source={img}
          />
          <View style={style.living}>
            <View style={style.circle} />
            <Text style={style.livingText}>直播中</Text>
          </View>
          <View style={style.cardMsgCont}>
            <View style={style.cardRow}>
              <Text style={style.title}>{card.title}</Text>
              <Text style={style.number}>{formatNumber(card.number)}</Text>
            </View>
            <View style={style.cardRow}>
              <Text style={style.description}>{card.description}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

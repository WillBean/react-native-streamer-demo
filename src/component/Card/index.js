import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';

import style from './style';

function formatNumber(num) {
  if (num > 10000) {
    return `${(num / 10000).toFixed(1)}万人`;
  }
  return `${num}人`;
}

export default class Card extends Component<{}> {
  static propTypes = {
    card: PropTypes.object.isRequired,
  }

  render() {
    const { card } = this.props;
    const {
      anchor, currentNumber, description, coverImage,
    } = card;
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
            source={{ uri: coverImage }}
          />
          <View style={style.living}>
            <View style={style.circle} />
            <Text style={style.livingText}>直播中</Text>
          </View>
          <View style={style.cardMsgCont}>
            <View style={style.cardRow}>
              <Text style={style.title}>{anchor}</Text>
              <Text style={style.number}>{formatNumber(currentNumber)}</Text>
            </View>
            <View style={style.cardRow}>
              <Text style={style.description}>{description}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

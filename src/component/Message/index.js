import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';

import style from './style';

function renderMsgItem(data) {
  const {
    type, msg, username, avatarImg, msgId,
  } = data;

  switch (type) {
    case 'msg':
      return (
        <View style={style.msgItem} key={msgId}>
          <View style={style.msgItemOuter}>
            <Image
              resizeMode="contain"
              style={style.avatar}
              source={{ uri: avatarImg }}
            />
            <View style={style.msgBox}>
              <Text style={style.name}>{username}</Text>
              <Text style={style.msgText}>{msg}</Text>
            </View>
          </View>
        </View>
      );
    case 'come':
      return (
        <View style={style.msgItem} key={msgId}>
          <View style={style.msgItemOuter}>
            <Text style={style.systemText}>
              用户[{username}]加入直播间
            </Text>
          </View>
        </View>
      );
    case 'leave':
      return (
        <View style={style.msgItem} key={msgId}>
          <View style={style.msgItemOuter}>
            <Text style={style.systemText}>
              用户[{username}]退出直播间
            </Text>
          </View>
        </View>
      );
    default:
      return null;
  }
}

export default class Message extends Component<{}> {
  static propTypes = {
    contStyle: PropTypes.number,
    message: PropTypes.array.isRequired,
  }

  static defaultProps = {
    contStyle: null,
  }

  render() {
    const { contStyle, message } = this.props;

    return (
      <View style={[style.container, contStyle]}>
        <ScrollView
          ref={(dom) => { this.view = dom; }}
          style={style.msgView}
          onContentSizeChange={() => {
            this.view.scrollToEnd();
          }}
        >
          <View style={style.placeholder} />
          {message.length ? message.map(msg => renderMsgItem(msg)) : null}
        </ScrollView>
      </View>
    );
  }
}

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';

import style from './style';
import avatarImg from '../../images/begin.png';

export default class Message extends Component<{}> {
  static propsType = {
    contStyle: PropTypes.object,
  }

  static defaultProps = {
    contStyle: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [1, 2, 3],
    };
  }

  componentDidMount() {
    setInterval(() => {
      const newData = this.state.data;
      newData.push(1);
      this.setState({ data: newData });
    }, 5000);
  }

  renderMsgItem() {
    const data = {
      name: 'GAKKI',
      msg: '发送了一条模拟信息',
    };

    return (
      <View style={style.msgItem} key={Math.random()}>
        <View style={style.msgItemOuter}>
          <Image
            resizeMode="contain"
            style={style.avatar}
            source={avatarImg}
          />
          <View style={style.msgBox}>
            <Text style={style.name}>{data.name}</Text>
            <Text style={style.msgText}>{data.msg}</Text>
          </View>
        </View>
      </View>

    );
  }

  render() {
    const { data } = this.state;
    const { contStyle } = this.props;

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
          {data.map(val => this.renderMsgItem())}
        </ScrollView>
      </View>
    );
  }
}

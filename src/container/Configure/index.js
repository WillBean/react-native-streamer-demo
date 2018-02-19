import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

import style from './style';
import playImg from '../../images/begin.png';

export default class Configure extends Component<{}> {
  static propTypes = {
    navigator: PropTypes.object,
    coverSource: PropTypes.object,
  };

  static defaultProps = {
    navigator: {},
    coverSource: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      description: '',
    };
  }

  handleCancel = () => {
    const { navigator } = this.props;
    navigator.dismissModal({
      screen: 'Configure',
    });
  }

  handlePlay = () => {
    const { navigator } = this.props;
    navigator.dismissModal({
      screen: 'Configure',
    });
    setTimeout(() => {
      navigator.push({
        screen: 'Live',
      });
    }, 500);
  }

  renderTabBar() {
    return (
      <LinearGradient
        colors={['#B11472', '#D01670', '#E61D72', '#E73151', '#E86224', '#F5D423']}
        locations={[0, 0.2, 0.3515, 0.5455, 0.7525, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={style.tabBar}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.handleCancel}
        >
          <Text style={style.tabText}>取消</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  render() {
    const { coverSource } = this.props;

    return (
      <View style={style.container}>
        {this.renderTabBar()}
        <ScrollView style={style.textCont}>
          <TextInput
            placeholder="加一些描述吧..."
            multiline={true}
            style={style.description}
            onChangeText={text => this.setState({ description: text })}
          />
          <View style={style.previewCont}>
            <Image
              resizeMode="contain"
              style={style.previewImg}
              source={coverSource}
            />
          </View>
        </ScrollView>
        <View style={style.bottomCont}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.handlePlay}
          >
            <Image
              style={style.playBtn}
              resizeMode="contain"
              source={playImg}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

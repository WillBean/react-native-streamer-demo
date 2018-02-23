import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  NativeModules,
  requireNativeComponent,
  TouchableOpacity, NativeEventEmitter, Keyboard, Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

import style from './style';
import Chat from '../../component/Chat';
import RoomInfo from '../../component/RoomInfo';
import { pushStreamUrl } from '../../common/config';
import Message from '../../component/Message';

const Player = requireNativeComponent('KSYPlayer', null);
const { KSYPlayerModule } = NativeModules;
const streamerEmitter = new NativeEventEmitter(KSYPlayerModule);

export default class Video extends Component<{}> {
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

    this.chatBottom = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);

    this.subscription = streamerEmitter.addListener('onIOSPlayerInfo', (e) => {
      console.log(e);
      if (e.type === 'inited') {
        KSYPlayerModule.prepareToPlay();
      }
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();

    this.subscription.remove();
    KSYPlayerModule.stop();
  }


  keyboardDidShow = (event) => {
    console.log(event);
    const { duration, endCoordinates } = event;
    Animated.timing(this.chatBottom, {
      duration,
      toValue: -endCoordinates.height,
    }).start();
  }

  keyboardDidHide = (event) => {
    const { duration } = event;
    Animated.timing(this.chatBottom, {
      duration,
      toValue: 0,
    }).start();
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
    const animateStyle = {
      transform: [{ translateY: this.chatBottom }],
    };

    return (
      <View style={style.container}>
        <Player style={style.player} url={`rtmp://live.hkstv.hk.lxdns.com/live/hks`} />
        <Animated.View style={[style.animateCont, animateStyle]}>
          <Chat />
          <Message contStyle={style.msgBottom} />
        </Animated.View>
        <RoomInfo />

      </View>
    );
  }
}

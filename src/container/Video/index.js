import React, { Component } from 'react';
import {
  View,
  Alert,
  NativeModules,
  requireNativeComponent,
  NativeEventEmitter, Keyboard, Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import style from './style';
import Chat from '../../component/Chat';
import RoomInfo from '../../component/RoomInfo';
import { BACK_END_SOCKET_SERVER_URL, pushStreamUrl } from '../../common/config';
import { fetchLiveStatus } from '../../common/api/lives';
import Message from '../../component/Message';

const Player = requireNativeComponent('KSYPlayer', null);
const { KSYPlayerModule } = NativeModules;
const streamerEmitter = new NativeEventEmitter(KSYPlayerModule);

@inject('userState')
@observer
export default class Video extends Component<{}> {
  static propTypes = {
    navigator: PropTypes.object,
    roomId: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    anchor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    liveId: PropTypes.string.isRequired,
    userState: PropTypes.shape({
      username: PropTypes.string,
      avatarImg: PropTypes.string,
      accessToken: PropTypes.string,
    }),
  };

  static defaultProps = {
    navigator: {},
    userState: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      message: [],
      currentNumber: 0,
    };

    this.chatBottom = new Animated.Value(0);
  }

  componentWillMount() {
    const { liveId, navigator, roomId } = this.props;
    fetchLiveStatus({ liveId })
      .then(res => res.json())
      .then((data) => {
        if (data.code !== 0) {
          Alert.alert(data.msg);
          navigator.pop();
        }
      });

    this.socketHelper(roomId);

    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);

    this.subscription = streamerEmitter.addListener('onIOSPlayerInfo', (e) => {
      console.log(e);
      if (e.type === 'inited') {
        KSYPlayerModule.prepareToPlay();
      } else if (e.type === 'MPMoviePlayerPlaybackDidFinishNotification') {
        Alert.alert('出错啦', '抱歉，直播间好像出了点问题 T_T', [
          { text: '确定', onPress: () => { /* navigator.pop(); */ } },
        ]);
      }
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();

    this.subscription.remove();
    KSYPlayerModule.stop();

    this.ws.close();
  }

  pushMessage = (chat, withNum) => {
    const { message } = this.state;
    if (message.length >= 20) {
      const list = message.slice(1, message.length);
      list.push(chat);
      if (!withNum) {
        this.setState({ message: list });
      } else {
        this.setState({ message: list, currentNumber: withNum });
      }
    } else if (!withNum) {
      message.push(chat);
      this.setState({ message });
    } else {
      message.push(chat);
      this.setState({ message, currentNumber: withNum });
    }
  }

  keyboardDidShow = (event) => {
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

  handleMessageSend = (msg) => {
    const { username, avatarImg } = this.props.userState;
    this.ws.send(JSON.stringify({
      msg,
      type: 'msg',
      username,
      avatarImg,
    }));
  }

  handleClose = () => {
    this.props.navigator.pop();
    this.ws.close();
  }

  socketHelper = (roomId) => {
    const { username: un, accessToken: at } = this.props.userState;
    this.ws = new WebSocket(`${BACK_END_SOCKET_SERVER_URL}/${roomId}/${un}/${at}`); // eslint-disable-line

    this.ws.onmessage = (socket) => {
      const message = JSON.parse(socket.data);
      const {
        type, msg, username, avatarImg, currentNumber, msgId,
      } = message;

      switch (type) {
        case 'msg':
          this.pushMessage({
            type, msg, username, avatarImg, msgId,
          });
          break;
        case 'come':
          this.pushMessage({ type, username, msgId }, currentNumber);
          break;
        case 'leave':
          this.pushMessage({ type, username, msgId }, currentNumber);
          break;
        case 'stop':
          Alert.alert('提示', '直播已经结束啦！去看看别的吧~', [
            { text: '确定', onPress: () => { this.props.navigator.pop(); } },
          ]);
          break;
        default:
      }
    };

    this.ws.onopen = () => {
      console.log('建立[WebSocket]连接');
    };

    this.ws.onclose = () => {
      console.log('断开[WebSocket]连接');
    };
  }

  render() {
    const {
      anchor, description, liveId, number,
    } = this.props;
    const { currentNumber, message } = this.state;
    const animateStyle = {
      transform: [{ translateY: this.chatBottom }],
    };

    return (
      <View style={style.container}>
        <Player style={style.player} url={`${pushStreamUrl}/${liveId}`} />
        <Animated.View style={[style.animateCont, animateStyle]}>
          <Chat onMessageSend={this.handleMessageSend} />
          <Message contStyle={style.msgBottom} message={message} />
        </Animated.View>
        <RoomInfo
          anchor={anchor}
          description={description}
          number={currentNumber || number}
          handleClose={this.handleClose}
        />
      </View>
    );
  }
}

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
    roomId: PropTypes.string.isRequired,
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
    super(props)
    this.state = {
      message: [],
      number: 0,
    }

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
    if (message.length > 20) {
      const list = this.chatList.slice(1, message.length);
      list.push(chat);
      if (!withNum) {
        this.setState({ message: list });
      } else {
        this.setState({ message: list, number: withNum });
      }
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

  socketHelper = (roomId) => {
    const { username: un, avatarImg: ai, accessToken: at } = this.props.userState;

    this.ws = new WebSocket(`${BACK_END_SOCKET_SERVER_URL}/${roomId}/${un}/${ai}/${at}`); // eslint-disable-line

    this.ws.onmessage = (data) => {
      const message = JSON.parse(data);
      const {
        type, msg, username, avatarImg, currentNumber,
      } = message;

      switch (type) {
        case 'msg':
          this.pushMessage({ msg, username, avatarImg });
          break;
        case 'come':
          this.pushMessage({ type, username }, currentNumber);
          break;
        case 'leave':
          this.pushMessage({ type, username }, currentNumber);
          break;
        case 'stop':
          Alert.alert('直播已经结束啦！去看看别的吧~');
          this.props.navigator.pop();
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
      anchor, description, liveId,
    } = this.props;
    const { number, message } = this.state;
    const animateStyle = {
      transform: [{ translateY: this.chatBottom }],
    };

    return (
      <View style={style.container}>
        <Player style={style.player} url={`${pushStreamUrl}/${liveId}`} />
        <Animated.View style={[style.animateCont, animateStyle]}>
          <Chat onMessageSend={this.handleMessageSend} />
          <Message contStyle={style.msgBottom} messages={message} />
        </Animated.View>
        <RoomInfo
          anchor={anchor}
          description={description}
          number={number}
        />
      </View>
    );
  }
}

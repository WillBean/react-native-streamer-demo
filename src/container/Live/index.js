import React, { Component } from 'react';
import {
  Text,
  Keyboard,
  Animated,
  ScrollView,
  View,
  Alert,
} from 'react-native';
import { Streamer, StreamerMethod } from 'react-native-streamer';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import styles from './style';
import Message from '../../component/Message';
import Configure from '../../component/Configure';
import ToolBar from '../../component/ToolBar';

import { fetchLivePrepare, fetchLivePlay, fetchLiveStop } from '../../common/api/lives';
import {
  pushStreamUrl,
  BACK_END_SOCKET_SERVER_URL,
} from '../../common/config';
import style from '../../component/RoomInfo/style';

@inject('userState')
@observer
export default class Live extends Component<{}> {
  static propTypes = {
    navigator: PropTypes.object,
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
      liveStatus: 'setting',
      playText: '正在连接',
      toolContIsShow: false,
      beautifyToolIsShow: false,
      enableBeautify: true,
      audioToolIsShow: false,
      hideToolCont: false,
      message: [],
    };

    this.configureBottom = new Animated.Value(0);
    this.btToolStyle = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    // 请求获取liveId
    const { username, accessToken } = this.props.userState;
    fetchLivePrepare({
      username,
      accessToken,
    }).then(res => res.json())
      .then((data) => {
        if (data.code === 0) {
          this.liveId = data.liveId;
          console.log(data.liveId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  setToolBarState = (state) => {
    const {
      enableBeautify, toolContIsShow, beautifyToolIsShow, audioToolIsShow, hideToolCont,
    } = state;
    const filter = {};
    if (enableBeautify !== undefined) {
      filter.enableBeautify = enableBeautify;
    }
    if (toolContIsShow !== undefined) {
      filter.toolContIsShow = toolContIsShow;
    }
    if (beautifyToolIsShow !== undefined) {
      filter.beautifyToolIsShow = beautifyToolIsShow;
    }
    if (audioToolIsShow !== undefined) {
      filter.audioToolIsShow = audioToolIsShow;
    }
    if (hideToolCont !== undefined) {
      filter.hideToolCont = hideToolCont;
    }
    this.setState(filter);
  }

  keyboardDidShow = (event) => {
    console.log(event);
    const { duration, endCoordinates } = event;
    Animated.timing(this.configureBottom, {
      duration,
      toValue: -endCoordinates.height,
    }).start();
  }

  keyboardDidHide = (event) => {
    const { duration } = event;
    Animated.timing(this.configureBottom, {
      duration,
      toValue: 0,
    }).start();
  }

  blurTextInput = () => {
    if (this.txtIn && this.txtIn.isFocused()) {
      this.txtIn.blur();
    }
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

  handleClose = () => {
    const { liveStatus } = this.state;
    const { navigator, userState } = this.props;
    const { username, accessToken } = userState;

    navigator.dismissModal({
      screen: 'Configure',
    });

    if (liveStatus === 'living') {
      const close = () => {
        this.ws.close();
        fetchLiveStop({
          username,
          accessToken,
          liveId: this.liveId,
        })
          .then(res => res.json())
          .then((data) => {
            if (data.code === 0) {
              __DEV__ && console.log('退出直播'); // eslint-disable-line
            }
          });
      };
      Alert.alert('结束直播', '您确定要结束直播吗？', [
        { text: '取消', onPress: () => {} },
        { text: '确定', onPress: close },
      ], { cancelable: false });
    }
  }

  handlePlay = (body) => {
    const { username, accessToken } = this.props.userState;
    body.append('username', username);
    body.append('accessToken', accessToken);
    body.append('liveId', this.liveId);

    fetchLivePlay(body)
      .then(res => res.json())
      .then((data) => {
        if (data.code === 0) {
          this.socketHelper(data.roomId);
          StreamerMethod.startStream();

          Animated.timing(this.configureBottom, {
            duration: 250,
            toValue: 500,
          }).start(() => {
            this.setState({
              liveStatus: 'living',
            });
          });
        } else {
          Alert.alert(data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  hideToolContainer = () => {
    this.setState({
      hideToolCont: false,
    });
  }

  renderMask = () => {
    const { liveStatus } = this.state;
    const bg = liveStatus === 'setting' ? { backgroundColor: 'rgba(0, 0, 0, .4)' } : null;
    return (
      <ScrollView
        style={[styles.mask, bg]}
        keyboardDismissMode="on-drag"
        onScroll={() => {
          const { toolContIsShow } = this.state;
          if (toolContIsShow) {
            this.hideToolContainer();
          }
        }}
      />
    );
  }

  renderNumber = () => {
    const { number } = this.state;
    return (
      <View style={styles.numberCont}>
        <Text style={style.infoText}><Text style={style.number}>{number}</Text>人正在观看直播</Text>
      </View>
    );
  }

  render() {
    const {
      toolContIsShow, liveStatus, playText, beautifyToolIsShow, audioToolIsShow, enableBeautify, hideToolCont, message,
    } = this.state;
    const configAnimateStyle = {
      transform: [{ translateY: this.configureBottom }],
    };
    const { navigator } = this.props;

    return (
      <View style={styles.container}>
        <Streamer
          style={styles.live}
          url={`${pushStreamUrl}/${this.liveId}`}
          onStreamerInfo={(info) => {
            console.log(info);
            if (info.type === 'init') {
              this.setState({
                playText: '开始直播',
              });
              StreamerMethod.startCameraPreview();
            }
          }}
        />
        {this.renderMask()}
        {liveStatus === 'living' ? this.renderNumber() : null}
        {liveStatus === 'setting' ?
          <Animated.View style={[styles.configureWrapper, configAnimateStyle]}>
            <Configure handlePlayBtnClick={this.handlePlay} playText={playText} />
          </Animated.View> :
          <Message message={message} />
        }
        <ToolBar
          navigator={navigator}
          hideToolCont={hideToolCont}
          enableBeautify={enableBeautify}
          toolContIsShow={toolContIsShow}
          audioToolIsShow={audioToolIsShow}
          beautifyToolIsShow={beautifyToolIsShow}
          blurTextInput={this.blurTextInput}
          setToolProps={this.setToolBarState}
          handleClose={this.handleClose}
        />
      </View>
    );
  }
}

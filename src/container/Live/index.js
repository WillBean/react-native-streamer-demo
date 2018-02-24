import React, { Component } from 'react';
import {
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

@inject('userState', 'messageState')
@observer
export default class Live extends Component<{}> {
  static propTypes = {
    navigator: PropTypes.object,
    userState: PropTypes.shape({
      username: PropTypes.string,
      avatarImg: PropTypes.string,
      accessToken: PropTypes.string,
    }),
    messageState: PropTypes.shape({
      number: PropTypes.number,
      push: PropTypes.func,
    }),
  };

  static defaultProps = {
    navigator: {},
    userState: {},
    messageState: {},
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

  socketHelper = (roomId) => {
    const { push } = this.props.messageState;
    const { username: un, avatarImg: ai, accessToken: at } = this.props.userState;

    this.ws = new WebSocket(`${BACK_END_SOCKET_SERVER_URL}/${roomId}/${un}/${ai}/${at}`); // eslint-disable-line

    this.ws.onmessage = (data) => {
      const message = JSON.parse(data);
      const {
        type, msg, username, avatarImg, currentNumber,
      } = message;

      switch (type) {
        case 'msg':
          push({ msg, username, avatarImg });
          break;
        case 'come':
          this.props.messageState.number = currentNumber;
          push({ type, username });
          break;
        case 'leave':
          this.props.messageState.number = currentNumber;
          push({ type, username });
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
    const { navigator, userState } = this.props;
    const { username, accessToken } = userState;

    navigator.dismissModal({
      screen: 'Configure',
    });
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

  renderMask = () => (
    <ScrollView
      style={styles.mask}
      keyboardDismissMode="on-drag"
      onScroll={() => {
          const { toolContIsShow } = this.state;
          if (toolContIsShow) {
            this.hideToolContainer();
          }
        }}
    />
  )

  render() {
    const {
      toolContIsShow, liveStatus, playText, beautifyToolIsShow, audioToolIsShow, enableBeautify, hideToolCont,
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
        {liveStatus === 'setting' ?
          <Animated.View style={[styles.configureWrapper, configAnimateStyle]}>
            <Configure handlePlayBtnClick={this.handlePlay} playText={playText} />
          </Animated.View> :
          <Message />
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

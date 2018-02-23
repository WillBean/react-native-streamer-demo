import React, { Component } from 'react';
import {
  Text,
  Image,
  Keyboard,
  Animated,
  ScrollView,
  TouchableOpacity,
  View,
  Slider,
  Switch,
  Picker,
  Alert,
} from 'react-native';
import { Streamer, StreamerMethod, StreamerConstants } from 'react-native-streamer';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import styles from './style';
import Message from '../../component/Message';
import Configure from '../../component/Configure';
import audioImg from '../../images/audio.png';
import closeImg from '../../images/close.png';
import toggleImg from '../../images/toggle.png';
import beautifyImg from '../../images/beautify.png';
import { fetchLivePrepare, fetchLivePlay } from '../../common/api/lives';
import {
  pushStreamUrl,
  beautifyGrindDefault,
  beautifyRuddyDefault,
  beautifyWhitenDefault,
  BACK_END_SOCKET_SERVER_URL,
} from '../../common/config';

function setBeatifyConfig(grind, whiten, ruddy) {
  StreamerMethod.setGrindRatio(grind);
  StreamerMethod.setWhitenRatio(whiten);
  StreamerMethod.setRuddyRatio(ruddy);
}

@inject('userState', 'liveState', 'messageState')
@observer
export default class Live extends Component<{}> {
  static propTypes = {
    navigator: PropTypes.object,
    userState: PropTypes.shape({
      username: PropTypes.string,
      avatarImg: PropTypes.string,
      accessToken: PropTypes.string,
    }),
    liveState: PropTypes.shape({
      list: PropTypes.array,
    }),
    messageState: PropTypes.shape({
      number: PropTypes.number,
      push: PropTypes.func,
    }),
  };

  static defaultProps = {
    navigator: {},
    userState: {},
    liveState: {},
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
      btGrind: beautifyGrindDefault,
      btWhiten: beautifyWhitenDefault,
      btRuddy: beautifyRuddyDefault,
      audioToolIsShow: false,
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
        }
      });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
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

  handlePlay = (body) => {
    const { username, accessToken } = this.props.userState;
    body.append('username', username);
    body.append('accessToken', accessToken);

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

  handleResetBeautify = () => {
    setBeatifyConfig(beautifyGrindDefault, beautifyWhitenDefault, beautifyRuddyDefault);
    this.setState({
      btGrind: beautifyGrindDefault,
      btWhiten: beautifyWhitenDefault,
      btRuddy: beautifyRuddyDefault,
    });
  }

  handleAudioFilter = () => {
    this.blurTextInput();
    const { audioToolIsShow } = this.state;
    const newState = {
      toolContIsShow: true,
      beautifyToolIsShow: false,
      audioToolIsShow: true,
    };
    if (!audioToolIsShow) {
      this.setState(newState);
    } else {
      this.hideToolContainer();
    }
  }

  handleBeautify = () => {
    this.blurTextInput();
    const { beautifyToolIsShow } = this.state;
    const newState = {
      toolContIsShow: true,
      beautifyToolIsShow: true,
      audioToolIsShow: false,
    };
    if (!beautifyToolIsShow) {
      this.setState(newState);
    } else {
      this.hideToolContainer();
    }
  }

  handleSwitchCamera = () => {
    this.blurTextInput();
    StreamerMethod.switchCamera();
  }

  handleClose = () => {
    const { navigator } = this.props;
    navigator.dismissModal({
      screen: 'Configure',
    });
  }

  showToolContainer = () => {
    Animated.timing(this.btToolStyle, {
      duration: 250,
      toValue: 65,
    }).start();
  }

  hideToolContainer = () => {
    Animated.timing(this.btToolStyle, {
      duration: 250,
      toValue: 0,
    }).start(() => {
      this.setState({
        toolContIsShow: false,
        beautifyToolIsShow: false,
        audioToolIsShow: false,
      });
    });
  }

  handleBtSwitchClick = (val) => {
    if (!val) {
      setBeatifyConfig(0, 0, 0);
    } else {
      const {
        btGrind,
        btWhiten,
        btRuddy,
      } = this.state;
      setBeatifyConfig(btGrind, btWhiten, btRuddy);
    }
    this.setState({ enableBeautify: val });
  }

  renderToolContainer = () => {
    const animateStyle = {
      transform: [{ translateY: this.btToolStyle }],
      opacity: this.btToolStyle.interpolate({
        inputRange: [0, 65],
        outputRange: [0, 1],
      }),
    };
    const { beautifyToolIsShow, audioToolIsShow } = this.state;

    return (
      <Animated.View
        style={[styles.btToolCont, animateStyle]}
        onLayout={this.showToolContainer}
      >
        {audioToolIsShow ? this.renderAudioTool() : null}
        {beautifyToolIsShow ? this.renderBeautifyTool() : null}
      </Animated.View>
    );
  }

  renderAudioTool = () => {
    const {
      AUDIO_EFFECT_CLOSE,
      AUDIO_EFFECT_TYPE_FEMALE,
      AUDIO_EFFECT_TYPE_MALE,
      AUDIO_EFFECT_TYPE_HEROIC,
      AUDIO_EFFECT_TYPE_ROBOT,
    } = StreamerConstants.AudioFilter.Effect;

    return (
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.btText}>变声器</Text>
          <Picker
            style={styles.audioPicker}
            mode="dropdown"
            itemStyle={styles.colorWhite}
            selectedValue={this.state.audioFilter}
            onValueChange={(filter) => {
              this.setState({ audioFilter: filter });
              StreamerMethod.setAudioEffectFilter(filter);
            }}
          >
            <Picker.Item label="关闭" value={AUDIO_EFFECT_CLOSE} />
            <Picker.Item label="萝莉" value={AUDIO_EFFECT_TYPE_FEMALE} />
            <Picker.Item label="大叔" value={AUDIO_EFFECT_TYPE_MALE} />
            <Picker.Item label="庄重" value={AUDIO_EFFECT_TYPE_HEROIC} />
            <Picker.Item label="机器人" value={AUDIO_EFFECT_TYPE_ROBOT} />
          </Picker>
        </View>
      </View>
    );
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

  renderBeautifyTool = () => {
    const {
      enableBeautify, btGrind, btWhiten, btRuddy,
    } = this.state;

    return (
      <View>
        <View style={styles.row}>
          <View style={styles.item}>
            <Text style={styles.btText}>磨皮</Text>
            <Slider
              disabled={!enableBeautify}
              style={styles.btSlider}
              value={btGrind}
              minimumTrackTintColor="#E61D72"
              onValueChange={(val) => {
                this.setState({ btGrind: val });
                StreamerMethod.setGrindRatio(val);
              }}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.btText}>美白</Text>
            <Slider
              disabled={!enableBeautify}
              style={styles.btSlider}
              value={btWhiten}
              minimumTrackTintColor="#E61D72"
              onValueChange={(val) => {
                this.setState({ btWhiten: val });
                StreamerMethod.setWhitenRatio(val);
              }}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.item}>
            <Text style={styles.btText}>红润</Text>
            <Slider
              disabled={!enableBeautify}
              style={styles.btSlider}
              value={btRuddy}
              minimumTrackTintColor="#E61D72"
              onValueChange={(val) => {
                this.setState({ btRuddy: val });
                StreamerMethod.setRuddyRatio(val);
              }}
            />
          </View>
          <View style={styles.item}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.handleResetBeautify}
            >
              <Text style={styles.resetBeautify}>恢复默认设置</Text>
            </TouchableOpacity>
            <Switch
              onTintColor="rgba(230,29,114,.6)"
              value={enableBeautify}
              onValueChange={this.handleBtSwitchClick}
            />
          </View>
        </View>
      </View>
    );
  }

  renderToolBar = () => (
    <View style={styles.toolBarCont}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.handleAudioFilter}
      >
        <Image
          style={styles.iconBtn}
          source={audioImg}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.handleBeautify}
      >
        <Image
          style={styles.iconBtn}
          source={beautifyImg}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.handleSwitchCamera}
      >
        <Image
          style={styles.iconBtn}
          source={toggleImg}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.handleClose}
        resizeMode="contain"
      >
        <Image
          style={styles.iconBtn}
          source={closeImg}
        />
      </TouchableOpacity>
    </View>
  )

  render() {
    const { toolContIsShow, liveStatus, playText } = this.state;
    const configAnimateStyle = {
      transform: [{ translateY: this.configureBottom }],
    };

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
        {this.renderToolBar()}
        {toolContIsShow ? this.renderToolContainer() : null}
      </View>
    );
  }
}

import React, { Component } from 'react';
import {
  Text,
  Image,
  Keyboard,
  Animated,
  TextInput,
  ScrollView,
  TouchableOpacity,
  View,
  Slider,
  Switch,
  Picker,
} from 'react-native';
import { Streamer, StreamerMethod, StreamerConstants } from 'react-native-streamer';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';

import styles from './style';
import audioImg from '../../images/audio.png';
import closeImg from '../../images/close.png';
import toggleImg from '../../images/toggle.png';
import beautifyImg from '../../images/beautify.png';
import { calculatePixel } from '../../common/util/tools';
import {
  pushStreamUrl,
  beautifyGrindDefault,
  beautifyRuddyDefault,
  beautifyWhitenDefault,
} from '../../common/config';

function setBeatifyConfig(grind, whiten, ruddy) {
  StreamerMethod.setGrindRatio(grind);
  StreamerMethod.setWhitenRatio(whiten);
  StreamerMethod.setRuddyRatio(ruddy);
}

export default class Live extends Component<{}> {
  static propTypes = {
    navigator: PropTypes.object,
  };

  static defaultProps = {
    navigator: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      coverSource: null,
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
    this.audioToolStyle = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    // 请求获取liveId
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
      toValue: endCoordinates.height,
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

  handlePlay = () => {
    StreamerMethod.startCameraPreview();
  }

  handleUploadImg = () => {
    const options = {
      title: '上传封面',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '从相册选取',
      maxWidth: calculatePixel(340),
      maxHeight: calculatePixel(450),
      quality: 0.8,
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        this.setState({ coverSource: source });
      }
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

  renderMask = () => {
    return (
      <ScrollView
        style={styles.mask}
        onScroll={() => {
          const { toolContIsShow } = this.state;
          if (toolContIsShow) {
            this.hideToolContainer();
          }
        }}
      />
    );
  }

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

  renderConfigure = () => {
    const { coverSource, playText } = this.state;
    return (
      <Animated.View style={[styles.configureCont, { bottom: this.configureBottom }]}>
        <View style={styles.configure}>
          <View style={styles.previewCont}>
            {coverSource ?
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.handleUploadImg}
              >
                <Image
                  style={styles.previewBtn}
                  source={coverSource}
                  resizeMode="cover"
                />
                <View style={[styles.tip, styles.tipWithBg]}>
                  <Text style={styles.tipText}>更换封面</Text>
                </View>
              </TouchableOpacity> :
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.handleUploadImg}
              >
                <View style={styles.uploadCont}>
                  <Text style={styles.cross}>+</Text>
                  <View style={[styles.tip, styles.textCont]}>
                    <Text style={styles.uploadText}>上传封面</Text>
                  </View>
                </View>
              </TouchableOpacity>
            }
          </View>
          <TextInput
            ref={(txtIn) => { this.txtIn = txtIn; }}
            placeholder="听说好看的人都来直播了，你还在等什么？"
            keyboardAppearance="dark"
            selectionColor="rgba(230,29,114,.6)"
            multiline={true}
            style={styles.description}
            placeholderTextColor="#888"
            onChangeText={text => this.setState({ description: text })}
          />
        </View>
        <View style={styles.control}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.handlePlay}
          >
            <LinearGradient
              colors={['#B11472', '#D01670', '#E61D72', '#E73151', '#E86224', '#F5D423']}
              locations={[0, 0.2, 0.3515, 0.5455, 0.7525, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.playBtn}
            >
              <Text style={styles.playText}>{playText}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  render() {
    const { toolContIsShow } = this.state;

    return (
      <View style={styles.container}>
        <Streamer
          style={styles.live}
          url={`${pushStreamUrl}stream`}
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
        {this.renderConfigure()}
        {this.renderToolBar()}
        {toolContIsShow ? this.renderToolContainer() : null}
      </View>
    );
  }
}

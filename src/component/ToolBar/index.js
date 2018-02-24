import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Slider,
  Switch,
  Picker,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { StreamerConstants, StreamerMethod } from 'react-native-streamer';
import PropTypes from 'prop-types';

import styles from './style';
import audioImg from '../../images/audio.png';
import closeImg from '../../images/close.png';
import toggleImg from '../../images/toggle.png';
import beautifyImg from '../../images/beautify.png';
import { beautifyGrindDefault, beautifyRuddyDefault, beautifyWhitenDefault } from '../../common/config';

function setBeatifyConfig(grind, whiten, ruddy) {
  StreamerMethod.setGrindRatio(grind);
  StreamerMethod.setWhitenRatio(whiten);
  StreamerMethod.setRuddyRatio(ruddy);
}

export default class ToolBar extends Component<{}> {
  static propTypes = {
    hideToolCont: PropTypes.bool.isRequired,
    toolContIsShow: PropTypes.bool.isRequired,
    beautifyToolIsShow: PropTypes.bool.isRequired,
    audioToolIsShow: PropTypes.bool.isRequired,
    enableBeautify: PropTypes.bool.isRequired,
    setToolProps: PropTypes.func.isRequired,
    blurTextInput: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      btGrind: beautifyGrindDefault,
      btWhiten: beautifyWhitenDefault,
      btRuddy: beautifyRuddyDefault,
    };

    this.btToolStyle = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) {
    const { hideToolCont } = this.props;
    if (hideToolCont && !nextProps.hideToolCont) {
      this.hideToolContainer();
    }
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
    const { audioToolIsShow, setToolProps, blurTextInput } = this.props;
    blurTextInput();
    const newState = {
      toolContIsShow: true,
      hideToolCont: true,
      beautifyToolIsShow: false,
      audioToolIsShow: true,
    };
    if (!audioToolIsShow) {
      setToolProps(newState);
    } else {
      this.hideToolContainer();
    }
  }

  handleSwitchCamera = () => {
    this.props.blurTextInput();
    StreamerMethod.switchCamera();
  }

  handleBeautify = () => {
    const { beautifyToolIsShow, setToolProps, blurTextInput } = this.props;
    blurTextInput();
    const newState = {
      toolContIsShow: true,
      hideToolCont: true,
      beautifyToolIsShow: true,
      audioToolIsShow: false,
    };
    if (!beautifyToolIsShow) {
      setToolProps(newState);
    } else {
      this.hideToolContainer();
    }
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
      this.props.setToolProps({
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
    console.log(val);
    this.props.setToolProps({ enableBeautify: val });
  }

  renderToolContainer = () => {
    const animateStyle = {
      transform: [{ translateY: this.btToolStyle }],
      opacity: this.btToolStyle.interpolate({
        inputRange: [0, 65],
        outputRange: [0, 1],
      }),
    };
    const { beautifyToolIsShow, audioToolIsShow } = this.props;

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

  renderBeautifyTool = () => {
    const {
      btGrind, btWhiten, btRuddy,
    } = this.state;
    const { enableBeautify } = this.props;

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

  render() {
    const { toolContIsShow, handleClose } = this.props;

    return (
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
          onPress={handleClose}
          resizeMode="contain"
        >
          <Image
            style={styles.iconBtn}
            source={closeImg}
          />
        </TouchableOpacity>
        {toolContIsShow ? this.renderToolContainer() : null}
      </View>
    );
  }
}

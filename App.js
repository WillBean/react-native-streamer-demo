/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Button,
  Text,
  Slider,
  Picker,
  Dimensions,
  requireNativeComponent,
  View,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';

const {KSYStreamerModule, ImgTexFilterModule, KSYAudioFilterConstantsModule} = NativeModules;
const {
  KSY_FILTER_BEAUTY_DISABLE,
  KSY_FILTER_BEAUTY_DENOISE,
  KSY_FILTER_BEAUTY_SKINWHITEN,
  KSY_FILTER_BEAUTY_SOFT,
  KSY_FILTER_BEAUTY_ILLUSION,
  KSY_FILTER_BEAUTY_SMOOTH,
  KSY_FILTER_BEAUTY_SOFT_EXT,
  KSY_FILTER_BEAUTY_SOFT_SHARPEN,
  KSY_FILTER_BEAUTY_PRO,
} = ImgTexFilterModule
const {
  AUDIO_EFFECT_TYPE_FEMALE,
  AUDIO_EFFECT_TYPE_MALE,
  AUDIO_EFFECT_TYPE_HEROIC,
  AUDIO_EFFECT_TYPE_ROBOT,
} = KSYAudioFilterConstantsModule;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
  'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
});

var iface = {
  name: 'RCTKSLiveView',
  propTypes: {
	url: PropTypes.string,
	previewResolution: PropTypes.array,
	targetResolution: PropTypes.array,
	previewFps: PropTypes.number,
	targetFps: PropTypes.number,
	videoKBitrate: PropTypes.array,
	audioSampleRate: PropTypes.number,
	audioKBitrate: PropTypes.number,
	cameraFacing: PropTypes.number,
	...View.propTypes
  }
}
const LiveComponet = requireNativeComponent('RCTKSLiveView', iface, {
  nativeOnly: {
	'previewFps': true,
	'encodeMethod': true,
	'cameraFacing': true,
	'rotateDegrees': true,
  }
})
const {width, height} = Dimensions.get('window')
let toggle = false;
export default class App extends Component<{}> {
  constructor(props) {
	super(props)
	this.state = {
	  facing: 0,
	}
	DeviceEventEmitter.addListener('onStreamerInfoListener', (params) => console.log(params,1111111))
	DeviceEventEmitter.addListener('onStreamerErrorListener', (params) => console.log(params,2222222))
  }

  render() {
	return (
      <View style={styles.container}>
        <LiveComponet
          style={styles.live}
          url={'rtmp://139.199.223.39/live/stream'}
          previewResolution={[480, 0]}
          targetResolution={[480, 0]}
          previewFps={15}
          targetFps={15}
          videoKBitrate={[600, 800, 400]}
          audioSampleRate={44100}
          audioKBitrate={48}
          cameraFacing={KSYStreamerModule.FACING_BACK}
        />

        <Button
          onPress={() => {
			KSYStreamerModule.startCameraPreview()
		  }}
          title="摄像头预览"
        />
        <Button
          onPress={() => {
			KSYStreamerModule.switchCamera()
		  }}
          title="切换摄像头"
        />
        <Button
          onPress={() => {
			toggle = !toggle;
			KSYStreamerModule.toggleTorch(toggle)
		  }}
          title="开关闪光灯"
        />
        <Button
          onPress={() => {
			KSYStreamerModule.startStream()
		  }}
          title="开始推流"
        />
        <Slider
          style={styles.slider}
          onValueChange={(val) => {
			// console.log(KSYStreamerModule.isGrindRatioSupported())
			// if (KSYStreamerModule.isGrindRatioSupported()) {
			KSYStreamerModule.setGrindRatio(val);
			// }
		  }}/>
        <Slider
          style={styles.slider}
          onValueChange={(val) => {
			// if (KSYStreamerModule.isWhitenRatioSupported()) {
			KSYStreamerModule.setWhitenRatio(val);
			// }
		  }}/>
        <Slider
          style={styles.slider}
          onValueChange={(val) => {
			// if (KSYStreamerModule.isRuddyRatioSupported()) {
			KSYStreamerModule.setRuddyRatio(val);
			// }
		  }}/>
        <Picker
          style={styles.picker}
          selectedValue={this.state.filter}
          onValueChange={(filter) => {
			this.setState({filter})
			KSYStreamerModule.setImgTexFilter(filter);
		  }}>
          <Picker.Item label="KSY_FILTER_BEAUTY_DISABLE" value={KSY_FILTER_BEAUTY_DISABLE}/>
          <Picker.Item label="KSY_FILTER_BEAUTY_DENOISE" value={KSY_FILTER_BEAUTY_DENOISE}/>
          <Picker.Item label="KSY_FILTER_BEAUTY_SKINWHITEN" value={KSY_FILTER_BEAUTY_SKINWHITEN}/>
          <Picker.Item label="KSY_FILTER_BEAUTY_SOFT" value={KSY_FILTER_BEAUTY_SOFT}/>
          <Picker.Item label="KSY_FILTER_BEAUTY_ILLUSION" value={KSY_FILTER_BEAUTY_ILLUSION}/>
          <Picker.Item label="KSY_FILTER_BEAUTY_SMOOTH" value={KSY_FILTER_BEAUTY_SMOOTH}/>
          <Picker.Item label="KSY_FILTER_BEAUTY_SOFT_EXT" value={KSY_FILTER_BEAUTY_SOFT_EXT}/>
          <Picker.Item label="KSY_FILTER_BEAUTY_SOFT_SHARPEN" value={KSY_FILTER_BEAUTY_SOFT_SHARPEN}/>
          <Picker.Item label="KSY_FILTER_BEAUTY_PRO" value={KSY_FILTER_BEAUTY_PRO}/>
        </Picker>
        <Picker
          style={styles.picker}
          selectedValue={this.state.audoiFilter}
          onValueChange={(filter) => {
			this.setState({audoiFilter: filter})
			KSYStreamerModule.setAudioEffectFilter(filter);
		  }}>
          <Picker.Item label="AUDIO_EFFECT_TYPE_FEMALE" value={AUDIO_EFFECT_TYPE_FEMALE}/>
          <Picker.Item label="AUDIO_EFFECT_TYPE_MALE" value={AUDIO_EFFECT_TYPE_MALE}/>
          <Picker.Item label="AUDIO_EFFECT_TYPE_HEROIC" value={AUDIO_EFFECT_TYPE_HEROIC}/>
          <Picker.Item label="AUDIO_EFFECT_TYPE_ROBOT" value={AUDIO_EFFECT_TYPE_ROBOT}/>
        </Picker>
      </View>
	);
  }
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '#fff'
  },
  welcome: {
	fontSize: 20,
	textAlign: 'center',
	margin: 10,
  },
  instructions: {
	textAlign: 'center',
	color: '#333333',
	marginBottom: 5,
  },
  live: {
	position: 'absolute',
	left: 0,
	top: 0,
	width: width,
	height: height,
  },
  slider: {
	width: width * 0.8
  },
  picker: {
	width: width * 0.8
  }
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Slider,
  Dimensions,
  View,
  Picker,
} from 'react-native';
import { Streamer, StreamerMethod, StreamerConstants } from 'react-native-streamer';

const { width, height } = Dimensions.get('window');
let toggle = false;
export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Streamer
          style={styles.live}
          url="rtmp://139.199.223.39/live/stream"
          onStreamerInfo={(info) => {
            console.log(info);
          }}
        />

        <Button
          onPress={() => {
            StreamerMethod.startCameraPreview();
          }}
          title="摄像头预览"
        />
        <Button
          onPress={() => {
            StreamerMethod.switchCamera();
          }}
          title="切换摄像头"
        />
        <Button
          onPress={() => {
            toggle = !toggle;
            StreamerMethod.toggleTorch(toggle);
          }}
          title="开关闪光灯"
        />
        <Button
          onPress={() => {
            StreamerMethod.startStream();
          }}
          title="开始推流"
        />
        <Button
          onPress={() => {
            StreamerMethod.stopStream();
          }}
          title="停止推流"
        />
        <Button
          onPress={() => {
            StreamerMethod.stopCameraPreview();
          }}
          title="停止预览"
        />
        <Slider
          style={styles.slider}
          onValueChange={(val) => {
            StreamerMethod.setGrindRatio(val);
          }}
        />
        <Slider
          style={styles.slider}
          onValueChange={(val) => {
            StreamerMethod.setWhitenRatio(val);
          }}
        />
        <Slider
          style={styles.slider}
          onValueChange={(val) => {
            StreamerMethod.setRuddyRatio(val);
          }}
        />

        <Picker
          style={styles.picker}
          selectedValue={this.state.audoiFilter}
          onValueChange={(filter) => {
            this.setState({ audoiFilter: filter });
            StreamerMethod.setAudioEffectFilter(filter);
          }}
        >
          <Picker.Item label="CLOSE" value={StreamerConstants.AudioFilter.Effect.AUDIO_EFFECT_CLOSE} />
          <Picker.Item label="FEMALE" value={StreamerConstants.AudioFilter.Effect.AUDIO_EFFECT_TYPE_FEMALE} />
          <Picker.Item label="MALE" value={StreamerConstants.AudioFilter.Effect.AUDIO_EFFECT_TYPE_MALE} />
          <Picker.Item label="HEROIC" value={StreamerConstants.AudioFilter.Effect.AUDIO_EFFECT_TYPE_HEROIC} />
          <Picker.Item label="ROBOT" value={StreamerConstants.AudioFilter.Effect.AUDIO_EFFECT_TYPE_ROBOT} />
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
    backgroundColor: '#fff',
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
    width,
    height,
  },
  slider: {
    width: width * 0.8,
  },
  picker: {
    width: width * 0.8,
  },
});

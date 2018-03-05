import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';

import styles from './style';
import { calculatePixel } from '../../common/util/tools';

export default class Configure extends Component<{}> {
  static propTypes = {
    handlePlayBtnClick: PropTypes.func.isRequired,
    playText: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      coverSource: null,
    };
  }

  handlePlay = () => {
    const { handlePlayBtnClick } = this.props;
    const { description } = this.state;

    const body = new FormData(); // eslint-disable-line
    body.append('imageData', this.imgData);
    body.append('filename', this.filename);
    body.append('description', description);
    handlePlayBtnClick(body);
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
      quality: 0.95,
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
        this.imgData = response.data;
        this.filename = response.fileName;
        this.setState({ coverSource: source });
      }
    });
  }

  render() {
    const { coverSource } = this.state;
    const { playText } = this.props;

    return (
      <View style={styles.configureCont}>
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
            underlineColorAndroid="transparent"
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
      </View>
    );
  }
}

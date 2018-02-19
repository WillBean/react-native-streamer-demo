import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';

import style from './style';
import { calculatePixel } from '../../common/util/tools';

export default class Account extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: null,
    };
  }

  handleSelectPhoto() {
    const options = {
      title: '上传头像',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '从相册选取',
      maxWidth: calculatePixel(180),
      maxHeight: calculatePixel(180),
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

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  render() {
    const { data } = this.props;

    return (
      <View style={style.page}>
        <LinearGradient
          colors={['#B11472', '#D01670', '#E61D72', '#E73151', '#E86224', '#F5D423']}
          locations={[0, 0.2, 0.3515, 0.5455, 0.7525, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={style.accountMsg}
        >
          <TouchableHighlight
            style={style.avatarCont}
            onPress={this.handleSelectPhoto.bind(this)}
          >
            <Image
              source={this.state.avatarSource}
              style={style.avatar}
            />
          </TouchableHighlight>
          <Text style={style.name}>GAKKI</Text>
          <Text style={style.description}>hdowfenoaifoeiafoahohohaeofdhwia</Text>
        </LinearGradient>
      </View>
    );
  }
}

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import style from './style';
import { calculatePixel } from '../../common/util/tools';
import defaultAvatarImg from '../../images/img.png';
import penImg from '../../images/pen.png';
import rightImg from '../../images/right.png';

@inject('userState')
@observer
export default class Account extends Component<{}> {
  static propTypes = {
    userState: PropTypes.shape({
      username: PropTypes.string,
      avatarImg: PropTypes.string,
      description: PropTypes.string,
      avatar: PropTypes.func,
      fetch: PropTypes.func,
      updateDesc: PropTypes.func,
    }),
  };

  static defaultProps = {
    userState: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      desc: null,
      descEnable: false,
    };
  }

  componentWillMount() {
    this.props.userState.fetch();
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
      maxWidth: calculatePixel(240),
      maxHeight: calculatePixel(240),
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
        const { data: d, fileName } = response;

        const body = new FormData(); // eslint-disable-line
        body.append('imageData', d);
        body.append('filename', fileName);
        this.props.userState.avatar(body);
      }
    });
  }

  handleEnableDesc = () => {
    const { descEnable, desc } = this.state;
    if (descEnable) {
      this.setState({ descEnable: false });
      desc && desc !== '' && this.props.userState.updateDesc(desc); // eslint-disable-line
    }
    if (!descEnable) {
      this.setState({ descEnable: true }, () => {
        this.descInput.focus();
      });
    }
  }

  render() {
    const { username, description, avatarImg } = this.props.userState;
    const { desc, descEnable } = this.state;
    const imgSource = avatarImg ? { uri: avatarImg } : defaultAvatarImg;
    const enableImg = !descEnable ? penImg : rightImg;

    return (
      <View style={style.page}>
        <LinearGradient
          colors={['#B11472', '#D01670', '#E61D72', '#E73151', '#E86224', '#F5D423']}
          locations={[0, 0.2, 0.3515, 0.5455, 0.7525, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={style.accountMsg}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={style.avatarCont}
            onPress={this.handleSelectPhoto.bind(this)}
          >
            <Image
              source={imgSource}
              style={style.avatar}
            />
          </TouchableOpacity>
          <Text style={style.name}>{username}</Text>
          <View style={style.descCont}>
            <TextInput
              ref={(dom) => { this.descInput = dom; }}
              style={style.description}
              multiline={true}
              numberOfLines={3}
              onChangeText={(des) => { this.setState({ desc: des }); }}
              value={desc || description}
              placeholder="写点什么吧，好让别人更了解你~"
              placeholderTextColor="#dddddd"
              editable={descEnable}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.handleEnableDesc}
            >
              <Image
                style={style.enable}
                source={enableImg}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

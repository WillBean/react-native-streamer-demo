import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import renderVistorAvatar from '../../common/util/renderVistorAvatar';

import style from './style';
import { calculatePixel } from '../../common/util/tools';
import penImg from '../../images/pen.png';
import rightImg from '../../images/right.png';

@inject('userState')
@observer
export default class Account extends Component<{}> {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    containerStyle: PropTypes.number,
    userState: PropTypes.shape({
      username: PropTypes.string,
      avatarImg: PropTypes.string,
      description: PropTypes.string,
      avatar: PropTypes.func,
      fetch: PropTypes.func,
      logout: PropTypes.func,
      updateDesc: PropTypes.func,
    }),
  };

  static defaultProps = {
    userState: {},
    containerStyle: null,
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

  handleLogout = () => {
    Alert.alert('退出登录', '您确定要退出登录吗？', [
      { text: '取消', onPress: () => {} },
      {
        text: '确定',
        onPress: () => {
          this.props.userState.logout();
        },
      },
    ], { cancelable: false });
  }

  handleLogin = () => {
    this.props.navigator.showModal({
      screen: 'Login',
      navigatorStyle: {
        navBarHidden: true,
      },
    });
  }

  handleRegister = () => {
    this.props.navigator.showModal({
      screen: 'Register',
      navigatorStyle: {
        navBarHidden: true,
      },
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
    const { containerStyle, userState } = this.props;
    const { description, avatarImg } = userState;
    const { desc, descEnable } = this.state;
    const enableImg = !descEnable ? penImg : rightImg;

    const isLoggedIn = !!userState.username;
    const username = userState.username || '游客';

    return (
      <View style={[style.page, containerStyle]}>
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
            {
              !avatarImg ?
                renderVistorAvatar(username) :
                <Image
                  source={{ uri: avatarImg }}
                  style={style.avatar}
                />
            }
          </TouchableOpacity>
          <Text style={style.name}>{username}</Text>
          {isLoggedIn ?
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
                underlineColorAndroid="transparent"
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
            </View> :
            null}
        </LinearGradient>
        <View
          style={style.control}
        >
          {isLoggedIn ?
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.handleLogout}
              >
                <LinearGradient
                  colors={['#B11472', '#D01670', '#E61D72', '#E73151', '#E86224', '#F5D423']}
                  locations={[0, 0.2, 0.3515, 0.5455, 0.7525, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={style.logoutBtn}
                >
                  <Text style={style.text}>退出登录</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View> :
            <View>
              <Text style={style.tip}>登录之后你就可以和他人分享你的直播啦~</Text>
              <View style={style.btnArea}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.handleLogin}
                >
                  <LinearGradient
                    colors={['#B11472', '#D01670', '#E61D72', '#E73151', '#E86224', '#F5D423']}
                    locations={[0, 0.2, 0.3515, 0.5455, 0.7525, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={style.btn}
                  >
                    <Text style={style.text}>登录</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.handleRegister}
                >
                  <LinearGradient
                    colors={['#B11472', '#D01670', '#E61D72', '#E73151', '#E86224', '#F5D423']}
                    locations={[0, 0.2, 0.3515, 0.5455, 0.7525, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={style.btn}
                  >
                    <Text style={style.text}>注册</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          }
        </View>
      </View>
    );
  }
}

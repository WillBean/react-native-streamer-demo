import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity, Keyboard, Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import style from './style';
import logoImg from '../../images/logo.png';
import accountImg from '../../images/acc.png';
import passwordImg from '../../images/pwd.png';

const { height } = Dimensions.get('window');

@inject('userState')
@observer
export default class Login extends Component<{}> {
  static propTypes = {
    navigator: PropTypes.object,
    userState: PropTypes.shape({
      username: PropTypes.string,
      accessToken: PropTypes.string,
      login: PropTypes.func,
      setUsername: PropTypes.func,
    }),
  };

  static defaultProps = {
    navigator: {},
    userState: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };

    this.translateY = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = (event) => {
    const { duration } = event;
    Animated.timing(this.translateY, {
      duration,
      toValue: -this.disToBottom,
    }).start();
  }

  keyboardDidHide = (event) => {
    const { duration } = event;
    Animated.timing(this.translateY, {
      duration,
      toValue: 0,
    }).start();
  }

  handleLogin = () => {
    const { password } = this.state;
    const { userState, navigator } = this.props;
    const { login, username } = userState;
    login(username, password)
      .then((data) => {
        if (data.code === 0) {
          navigator.dismissModal({
            screen: 'Login',
          });
        } else {
          Alert.alert('出错啦', '账号或密码错误', [
            { text: '确定', onPress: () => { this.pwd.focus(); } },
          ]);
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  handleRegister = () => {
    const { navigator } = this.props;
    navigator.showModal({
      screen: 'Register',
      navigatorStyle: {
        navBarHidden: true,
      },
    });
  }

  render() {
    const transformStyle = {
      transform: [{ translateY: this.translateY }],
    };
    const { password } = this.state;
    const { username, setUsername } = this.props.userState;

    return (
      <LinearGradient
        colors={['#B11472', '#D01670', '#E61D72', '#E73151', '#E86224', '#F5D423']}
        locations={[0, 0.2, 0.3515, 0.5455, 0.7525, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={style.accountCont}
      >
        <Animated.View style={[style.animateCont, transformStyle]}>
          <Image
            style={style.logo}
            source={logoImg}
          />
          <View style={style.outer}>
            <Image
              style={style.icon}
              source={accountImg}
            />
            <TextInput
              placeholder="手机/邮箱/用户名"
              placeholderTextColor="#fff"
              maxLength={24}
              underlineColorAndroid="transparent"
              value={username}
              onChangeText={(val) => { setUsername(val); }}
              style={style.input}
              onSubmitEditing={() => { this.pwd.focus(); }}
            />
          </View>
          <View style={style.outer}>
            <Image
              style={style.icon}
              source={passwordImg}
            />
            <TextInput
              ref={(dom) => { this.pwd = dom; }}
              placeholder="密码"
              placeholderTextColor="#fff"
              maxLength={24}
              value={password}
              underlineColorAndroid="transparent"
              onChangeText={(val) => { this.setState({ password: val }); }}
              secureTextEntry={true}
              style={style.input}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.handleLogin}
          >
            <View style={style.login}>
              <Text style={style.loginText}>登录</Text>
            </View>
          </TouchableOpacity>
          <View
            style={style.tool}
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout;
              this.disToBottom = height - y;
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.handleRegister}
            >
              <Text style={style.register}>注册</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    );
  }
}

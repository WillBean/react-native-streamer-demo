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
export default class Register extends Component<{}> {
  static propTypes = {
    navigator: PropTypes.object,
    userState: PropTypes.shape({
      username: PropTypes.string,
      register: PropTypes.func,
    }),
  };

  static defaultProps = {
    navigator: {},
    userState: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      password: '',
      confirm: '',
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

  handleRegister = () => {
    const { account, password, confirm } = this.state;

    if (account === '' || password === '' || confirm === '') {
      Alert.alert('输入栏不能为空！');
      return;
    }

    if (password !== confirm) {
      Alert.alert('密码不一致！');
      return;
    }

    const { userState } = this.props;
    const { register } = userState;
    register(account, password)
      .then((data) => {
        if (data.code !== 0) {
          Alert.alert('出错啦', data.msg, [
            { text: '确定', onPress: () => { this.pwd.focus(); } },
          ]);
        } else {
          this.handleCancel();
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  handleCancel = () => {
    const { navigator } = this.props;
    navigator.dismissModal({
      screen: 'Register',
    });
  }

  render() {
    const transformStyle = {
      transform: [{ translateY: this.translateY }],
    };
    const { account, password, confirm } = this.state;

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
              value={account}
              onChangeText={(val) => { this.setState({ account: val }); }}
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
              onChangeText={(val) => { this.setState({ password: val }); }}
              secureTextEntry={true}
              style={style.input}
              onSubmitEditing={() => { this.confirm.focus(); }}
            />
          </View>
          <View style={style.outer}>
            <Image
              style={style.icon}
              source={passwordImg}
            />
            <TextInput
              ref={(dom) => { this.confirm = dom; }}
              placeholder="确认密码"
              placeholderTextColor="#fff"
              maxLength={24}
              value={confirm}
              onChangeText={(val) => { this.setState({ confirm: val }); }}
              secureTextEntry={true}
              style={style.input}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.handleRegister}
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout;
              this.disToBottom = height - y;
            }}
          >
            <View style={style.login}>
              <Text style={style.loginText}>注册</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.handleCancel}
          style={style.cancel}
        >
          <Text style={style.register}>取消</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}

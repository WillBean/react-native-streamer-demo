import React, { Component } from 'react';
import {
  Image,
  View,
  TextInput,
  Keyboard,
} from 'react-native';

import style from './style';
import chatImg from '../../images/chat.png';

export default class Account extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
    };
  }

  componentWillMount() {}

  componentWillUnmount() {

  }

  render() {
    const { inputText } = this.state;


    return (
      <View style={style.container}>
        <Image
          resizeMode="contain"
          source={chatImg}
          style={style.chatImg}
        />
        <TextInput
          style={style.chatInput}
          placeholder="对主播说点什么呗？"
          keyboardAppearance="dark"
          selectionColor="rgba(230,29,114,.6)"
          multiline={false}
          value={inputText}
          placeholderTextColor="#bbb"
          onChangeText={text => this.setState({ inputText: text })}
          onSubmitEditing={() => {
            // send the message
            this.setState({
              inputText: '',
            });
          }}
        />
      </View>
    );
  }
}

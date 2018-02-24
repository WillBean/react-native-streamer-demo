import React, { Component } from 'react';
import {
  Image,
  View,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';

import style from './style';
import chatImg from '../../images/chat.png';

export default class Chat extends Component<{}> {
  static propTypes = {
    onMessageSend: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
    };
  }

  render() {
    const { inputText } = this.state;
    const { onMessageSend } = this.props;

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
            onMessageSend(inputText);
            this.setState({
              inputText: '',
            });
          }}
        />
      </View>
    );
  }
}

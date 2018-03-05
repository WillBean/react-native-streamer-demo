import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { calculatePixel } from './tools';

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#54bfff',
    height: calculatePixel(90),
    width: calculatePixel(90),
    borderRadius: calculatePixel(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: calculatePixel(36),
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default function (username, size = null, fontSize = null) {
  return (
    <View style={[styles.avatar, size]}>
      <Text style={[styles.name, fontSize]}>{username[0]}</Text>
    </View>
  );
};

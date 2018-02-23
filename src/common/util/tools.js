import {
  Platform,
  Dimensions,
} from 'react-native';

export function calculatePixel(pixel) {
  const { width } = Dimensions.get('window');
  if (Platform.OS === 'ios') {
    // 6p 等
    if (width >= 414) {
      return pixel * 1.15;
    } else if (width <= 320) {
      return (pixel * width) / 375;
    }
  } else {
    if (width === 360) return pixel;
    if (width < 600) {
      return (pixel * width) / 360;
    }
    return (pixel * 600) / 360;
  }
  return pixel;
}

export function formatQuery(query) {
  let queryString = '?';
  for (const key in query) {
    queryString += `${key}=${query[key]}&`;
  }
  return queryString.replace(/&$/, '');
}

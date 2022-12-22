import 'react-native-get-random-values';
import { customAlphabet } from 'nanoid';
import { Image } from 'react-native';

// https://zelark.github.io/nano-id-cc/ for collision calculator
// default setting gives 196 years for 1% collision for 5 IDs/hour
export const generateCode = (alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890', size = 10) => {
  return customAlphabet(alphabet, size)();
};

export const loadImage = async (uri: string) => {
  return await Image.prefetch(uri);
};

export const loadImages = async (uriSources: string[]) => {
  return await Promise.all(uriSources.map(async (source) => await loadImage(source)));
};

export function isAllLetter(c: string) {
  return !/[^a-z]/i.test(c);
}

export function getMatchingCharacters(a: string, b: string) {
  return a
    .split('')
    .reduce((accumulator, char, index) => accumulator + (char === b.charAt(index) ? 1 : 0), 0);
}

export const interpolate = (value: number, x: [number, number], y: [number, number]) => {
  if (value < x[0]) {
    return y[0];
  }
  if (value > x[1]) {
    return y[1];
  }

  if (x[1] - x[0] === 0) {
    return y[0];
  }

  return y[0] + (value - x[0]) * ((y[1] - y[0]) / (x[1] - x[0]));
};

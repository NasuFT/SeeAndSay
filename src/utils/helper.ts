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

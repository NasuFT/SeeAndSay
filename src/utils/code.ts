import 'react-native-get-random-values';
import { customAlphabet } from 'nanoid';

// https://zelark.github.io/nano-id-cc/ for collision calculator
// default setting gives 196 years for 1% collision for 5 IDs/hour
export const generateCode = (alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890', size = 10) => {
  return customAlphabet(alphabet, size)();
};

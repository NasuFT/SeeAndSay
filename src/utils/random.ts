import 'react-native-get-random-values';

export const getRandomValues = (n: number) => {
  const arr = new Uint32Array(n);

  crypto.getRandomValues(arr);

  return arr;
};

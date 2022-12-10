import * as Clipboard from 'expo-clipboard';

export const setString = async (value: string) => {
  await Clipboard.setStringAsync(value);
};

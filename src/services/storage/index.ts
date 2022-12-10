import storage from '@react-native-firebase/storage';

export const getFile = async (url: string) => {
  const ref = storage().ref(url);

  return await ref.getDownloadURL();
};

export const getFiles = async (sources: string[]) => {
  const data = await Promise.all(sources.map(async (source) => await getFile(source)));

  return data;
};

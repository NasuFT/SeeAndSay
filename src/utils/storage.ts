import storage from '@react-native-firebase/storage';

export const getURL = async (sources: string[]) => {
  const data = await Promise.all(
    sources.map(async (source) => {
      const reference = storage().ref(source);

      return await reference.getDownloadURL();
    })
  );

  return data;
};

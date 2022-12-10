import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

const createHash = async (value: string) => {
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value);

  return digest;
};

export const downloadFile = async (url: string, prefix: string = '') => {
  const fileUri = FileSystem.cacheDirectory + prefix + (await createHash(url));

  const download = FileSystem.createDownloadResumable(url, fileUri);

  await download.downloadAsync();

  return fileUri;
};

export const downloadFiles = async (sources: string[]) => {
  const data = await Promise.all(sources.map(async (source) => await downloadFile(source)));

  return data;
};

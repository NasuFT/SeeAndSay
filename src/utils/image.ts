import { Image } from 'react-native';

export const loadImage = async (uri: string) => {
  return await Image.prefetch(uri);
};

export const loadImages = async (uriSources: string[]) => {
  return await Promise.all(uriSources.map(async (source) => await loadImage(source)));
};

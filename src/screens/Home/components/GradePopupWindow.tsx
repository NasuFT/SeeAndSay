import { View, StyleProp, ViewStyle, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { Audio, AVPlaybackSource } from 'expo-av';
import React, { useEffect, useRef } from 'react';
import { useDerivedValue } from 'react-native-reanimated';

interface Props {
  grade?: number | null;
  style?: StyleProp<ViewStyle>;
}

const getGradeStatus = (grade?: number | null) => {
  if (!grade) {
    return '';
  }

  if (grade >= 100) {
    return 'PERFECT!';
  }
  if (grade >= 90) {
    return 'WELL DONE!';
  }
  if (grade >= 75) {
    return 'GOOD JOB!';
  }
  if (grade >= 40) {
    return 'NICE TRY!';
  }

  return 'NICE TRY!';
};

const getSourceFileToPlay = (grade?: number | null) => {
  if (!grade) {
    return null;
  }

  if (grade >= 100) {
    return require('@/../assets/sounds/game_finish_perfect.mp3');
  }

  if (grade >= 90) {
    return require('@/../assets/sounds/game_finish_well-done.mp3');
  }

  if (grade >= 75) {
    return require('@/../assets/sounds/game_finish_good-job.wav');
  }

  return require('@/../assets/sounds/game_finish_nice-try.mp3');
};

const getImageFileToShow = (grade?: number | null) => {
  if (!grade) {
    return undefined;
  }

  if (grade >= 100) {
    return require('@/../assets/ui/game_finish/perfect.gif');
  }

  if (grade >= 90) {
    return require('@/../assets/ui/game_finish/well_done.gif');
  }

  if (grade >= 75) {
    return require('@/../assets/ui/game_finish/good_job.gif');
  }

  return require('@/../assets/ui/game_finish/nice_try.gif');
};

const GradePopupWindow = ({ grade = 100, style }: Props) => {
  const sound = useRef<Audio.Sound>(new Audio.Sound());

  const loadAudio = async (file: AVPlaybackSource | null) => {
    if (file === null) {
      return;
    }

    await sound.current.loadAsync(file, { volume: 0.8 });
    await sound.current.playAsync();
  };

  const unloadAudio = async () => {
    sound.current.unloadAsync();
  };

  useEffect(() => {
    loadAudio(getSourceFileToPlay(grade));

    return () => {
      unloadAudio();
    };
  }, [grade]);

  return (
    <View style={[style]}>
      <Text variant="headlineSmall" style={{ textAlign: 'center' }}>{`Grade: ${grade?.toFixed(
        2
      )}`}</Text>
      <Text variant="titleMedium" style={{ textAlign: 'center', marginTop: 12 }}>
        {getGradeStatus(grade)}
      </Text>
      <Image
        resizeMode="contain"
        source={getImageFileToShow(grade)}
        style={{ marginTop: 24, width: 128, height: 128, alignSelf: 'center' }}
      />
    </View>
  );
};

export default GradePopupWindow;

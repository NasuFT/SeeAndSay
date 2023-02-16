import { View, StyleProp, ViewStyle, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { Audio } from 'expo-av';
import React, { useEffect, useRef } from 'react';

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

  if (grade >= 90) {
    return require('@/../assets/sounds/game_finish_perfect_well-done.mp3');
  }

  return require('@/../assets/sounds/game_finish_other.mp3');
};

const GradePopupWindow = ({ grade = 95, style }: Props) => {
  const sound = useRef<Audio.Sound>(new Audio.Sound());

  const loadAudio = async () => {
    const file = getSourceFileToPlay(grade);
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
    loadAudio();

    return () => {
      unloadAudio();
    };
  }, []);

  return (
    <View style={[style]}>
      <Text variant="headlineSmall" style={{ textAlign: 'center' }}>{`Grade: ${grade}`}</Text>
      <Text variant="titleMedium" style={{ textAlign: 'center', marginTop: 12 }}>
        {getGradeStatus(grade)}
      </Text>
      <Image
        source={require('@/../assets/ui/good_job.gif')}
        style={{ marginTop: 24, width: 128, height: 128, alignSelf: 'center' }}
      />
    </View>
  );
};

export default GradePopupWindow;

import { Button, Screen } from '@/components';
import { RootStackScreenProps } from '@/navigators/types';
import { GameType } from '@/types';
import { loadImages } from '@/utils/image';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useState } from 'react';
import { Text } from 'react-native-paper';
import useGamePrepareContainer from './useGamePrepareContainer';

const getGameTypeTitle = (type: GameType) => {
  return type === 'classic'
    ? 'Classic'
    : type === 'describeme'
    ? 'Describe Me'
    : type === 'fourpicsoneword'
    ? 'Four Pics One Word'
    : type === 'puzzle'
    ? 'Puzzle'
    : // type === 'scavengerhunt'
      'Scavenger Hunt';
};

const GamePrepare = () => {
  const { dailyTask, fetchImageSources } = useGamePrepareContainer();

  if (!dailyTask) {
    return null;
  }

  const { game } = dailyTask;

  const navigation = useNavigation<RootStackScreenProps<'GamePrepare'>['navigation']>();

  const [isLoading, setIsLoading] = useState(false);
  const handleStartPress = async () => {
    try {
      setIsLoading(true);
      await fetchImageSources(dailyTask);
      navigation.replace('Game');
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <Text variant="headlineLarge" numberOfLines={1} adjustsFontSizeToFit>
        {dailyTask.title}
      </Text>
      <Text variant="titleLarge" style={{ marginTop: 32 }}>
        {getGameTypeTitle(game.type)}
      </Text>
      <Text variant="labelLarge" style={{ marginTop: 8 }}>
        {format(dailyTask.submissionDate, 'MMMM d, yyyy')}
      </Text>
      <Button
        onPress={handleStartPress}
        mode="contained"
        contentStyle={{ paddingHorizontal: 8 }}
        style={{ marginTop: 32 }}
        disabled={isLoading}
        loading={isLoading}>
        Start
      </Button>
    </Screen>
  );
};

export default GamePrepare;

import { Button, Screen } from '@/components';
import { RootStackScreenProps } from '@/navigators/types';
import { GameType } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useState } from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
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
  const { dailyTask, getImageSources } = useGamePrepareContainer();

  if (!dailyTask) {
    return null;
  }

  const { game } = dailyTask;

  const navigation = useNavigation<RootStackScreenProps<'GamePrepare'>['navigation']>();

  const [isLoading, setIsLoading] = useState(false);
  const handleStartPress = async () => {
    try {
      setIsLoading(true);
      await getImageSources();
      navigation.replace('Game');
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen withBackground style={{ alignItems: 'stretch' }}>
      <IconButton
        icon="arrow-left"
        size={24}
        style={{
          alignSelf: 'flex-start',
          borderColor: '#facd89',
          borderWidth: 2,
          marginLeft: 16,
        }}
        mode="contained"
        containerColor="#3c5e47"
        iconColor="#ffffff"
        onPress={() => navigation.goBack()}
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          style={{
            margin: 16,
            paddingVertical: 16,
            borderWidth: 4,
            borderColor: '#facd89',
            backgroundColor: '#3c5e47',
          }}>
          <Text
            variant="headlineLarge"
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ color: '#ffffff', textAlign: 'center' }}>
            {dailyTask.game.title}
          </Text>
          <Text
            variant="titleLarge"
            style={{ marginTop: 32, color: '#ffffff', textAlign: 'center' }}>
            {getGameTypeTitle(game.type)}
          </Text>
          <Text
            variant="labelLarge"
            style={{ marginTop: 8, color: '#ffffff', textAlign: 'center' }}>
            {format(dailyTask.submissionDate, 'MMMM d, yyyy')}
          </Text>
        </View>
        <Button
          onPress={handleStartPress}
          mode="contained"
          contentStyle={{ paddingHorizontal: 8 }}
          style={{ marginTop: 16, alignSelf: 'center' }}
          disabled={isLoading}
          loading={isLoading}>
          Start
        </Button>
      </View>
    </Screen>
  );
};

export default GamePrepare;

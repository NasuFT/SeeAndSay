import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { millisecondsToSeconds } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { Button, Text } from 'react-native-paper';

import { ScrollingScreen } from '@/components';
import { useTimer } from '@/hooks';
import { GameInfo, SubmissionDataScavengerHunt } from '@/types';
import { RootStackScreenProps } from '@/navigators/types';

import GameCounter from '../components/GameCounter';
import Timer from '../components/Timer';
import MarkableImage from '../components/MarkableImage';

interface Props {
  game: GameInfo;
  images: string[];
  onSubmit?:
    | ((answers: SubmissionDataScavengerHunt, time: number) => void)
    | ((answers: SubmissionDataScavengerHunt, time: number) => Promise<void>);
}

const ScavengerHunt = ({ game, images, onSubmit }: Props) => {
  const { type, seconds, rounds } = game;
  if (type !== 'scavengerhunt') {
    throw new Error('Game Type must be "scavengerhunt"');
  }

  const { time, startTimer, stopTimer } = useTimer(seconds * 1000);

  const [round, setRound] = useState(1);
  const currentImageSource = useMemo(() => images[round - 1], [images, round]);
  const currentGameItem = useMemo(() => game.data[round - 1], [game]);

  const isFinalRound = useMemo(() => round === rounds, [round]);

  const [input, _setInput] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [answers, _setAnswers] = useState<{ x: number; y: number }[]>([]);
  const inputRef = useRef(input);
  const answersRef = useRef(answers);

  const setInput = (value: { x: number; y: number }) => {
    inputRef.current = value;
    _setInput(value);
  };
  const setAnswers = (value: { x: number; y: number }[]) => {
    answersRef.current = value;
    _setAnswers(value);
  };
  useLayoutEffect(() => {
    startTimer();

    return () => stopTimer();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePress = async () => {
    if (isFinalRound) {
      try {
        const data: SubmissionDataScavengerHunt = answers
          .concat([inputRef.current])
          .map((answer) => ({ answer }));
        setIsSubmitting(true);
        await onSubmit?.(data, time);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const newAnswers = answers.concat([inputRef.current]);
    setRound((round) => round + 1);
    setAnswers(newAnswers);
    setInput({ x: 0, y: 0 });
  };

  const navigation = useNavigation<RootStackScreenProps<'Game'>['navigation']>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={handlePress} disabled={isSubmitting} loading={isSubmitting}>
          {isFinalRound ? 'Submit' : 'Next'}
        </Button>
      ),
    });
  }, [isFinalRound]);

  return (
    <ScrollingScreen
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 0,
        alignItems: 'stretch',
        paddingTop: 16,
      }}
      style={{ flexGrow: 1 }}>
      <GameCounter
        currentRound={round}
        totalRounds={game.rounds}
        style={{ alignSelf: 'flex-end', marginRight: 16 }}
      />
      <Timer seconds={millisecondsToSeconds(time)} style={{ marginTop: 32, alignSelf: 'center' }} />
      <MarkableImage
        imageSource={currentImageSource}
        style={{ marginTop: 32 }}
        onValueChange={setInput}
      />
      <View style={{ marginVertical: 40, paddingHorizontal: 16 }}>
        <Text variant="titleMedium" style={{ textAlign: 'center' }}>
          {currentGameItem.description}
        </Text>
      </View>
    </ScrollingScreen>
  );
};

export default ScavengerHunt;

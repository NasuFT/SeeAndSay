import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ScrollingScreen } from '@/components';
import GameCounter from '../components/GameCounter';
import Timer from '../components/Timer';
import SingleImage from '../components/SingleImage';
import InputTiled from '../components/InputTiled';
import { millisecondsToSeconds } from 'date-fns';
import { GameInfo, SubmissionDataClassic } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigators/types';
import { useTimer } from '@/hooks';
import { Button } from 'react-native-paper';

interface Props {
  game: GameInfo;
  images: string[];
  onSubmit?:
    | ((answers: SubmissionDataClassic, time: number) => void)
    | ((answers: SubmissionDataClassic, time: number) => Promise<void>);
}

const Classic = ({ game, images, onSubmit }: Props) => {
  const { type, data, seconds, rounds } = game;
  if (type !== 'classic') {
    throw new Error('Game Type must be "classic"');
  }

  const { time, startTimer, stopTimer } = useTimer(seconds * 1000);

  const [round, setRound] = useState(1);
  const currentGameItem = useMemo(() => data[round - 1], [data, round]);
  const currentImageSource = useMemo(() => images[round - 1], [images, round]);

  const isFinalRound = useMemo(() => round === rounds, [round, rounds]);

  const [input, _setInput] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const inputRef = useRef(input);

  const setInput = (value: string) => {
    inputRef.current = value;
    _setInput(value);
  };
  useLayoutEffect(() => {
    startTimer();

    return () => stopTimer();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePress = useCallback(async () => {
    if (isFinalRound) {
      try {
        const data: SubmissionDataClassic = answers
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
    setInput('');
  }, [isFinalRound]);

  const navigation = useNavigation<RootStackScreenProps<'Game'>['navigation']>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={handlePress} disabled={isSubmitting} loading={isSubmitting}>
          {isFinalRound ? 'Submit' : 'Next'}
        </Button>
      ),
    });
  }, [isFinalRound, isSubmitting]);

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
      <SingleImage source={currentImageSource} style={{ marginTop: 32 }} />
      <InputTiled
        length={currentGameItem.word.length}
        value={input}
        onChange={setInput}
        style={{ marginTop: 16, flex: 1 }}
      />
    </ScrollingScreen>
  );
};

export default Classic;

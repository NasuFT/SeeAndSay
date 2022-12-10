import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ScrollingScreen } from '@/components';
import GameCounter from '../components/GameCounter';
import Timer from '../components/Timer';
import { millisecondsToSeconds } from 'date-fns';
import { GameInfo, SubmissionDataPuzzle } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigators/types';
import { useTimer } from '@/hooks';
import { Button } from 'react-native-paper';
import SortableSplitImage from '../components/SortableSplitImage';

interface Props {
  game: GameInfo;
  images: string[];
  onSubmit?:
    | ((answers: SubmissionDataPuzzle, time: number) => void)
    | ((answers: SubmissionDataPuzzle, time: number) => Promise<void>);
}

const Puzzle = ({ game, images, onSubmit }: Props) => {
  const { type, data, seconds, rounds } = game;
  if (type !== 'puzzle') {
    throw new Error('Game Type must be "puzzle"');
  }

  const { time, startTimer, stopTimer } = useTimer(seconds * 1000);

  const [round, setRound] = useState(1);
  const currentGameItem = useMemo(() => data[round - 1], [data, round]);
  const currentImageSource = useMemo(() => images[round - 1], [images, round]);

  const isFinalRound = useMemo(() => round === rounds, [round]);

  const [input, _setInput] = useState<number[]>([]);
  const [answers, setAnswers] = useState<number[][]>([]);
  const inputRef = useRef(input);

  const setInput = (value: number[]) => {
    inputRef.current = value;
    _setInput(value);
  };
  useLayoutEffect(() => {
    startTimer();

    return () => stopTimer();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePress = async () => {
    if (isFinalRound) {
      try {
        const data: SubmissionDataPuzzle = answers
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
    setInput([]);
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
  }, [isFinalRound, isSubmitting]);

  useEffect(() => {
    console.log(input);
  }, [input]);

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
      <SortableSplitImage
        size={currentGameItem.size}
        imageSource={currentImageSource}
        onValueChange={setInput}
        style={{ marginTop: 32 }}
      />
    </ScrollingScreen>
  );
};

export default Puzzle;

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ScrollingScreen } from '@/components';
import GameCounter from '../components/GameCounter';
import Timer from '../components/Timer';
import SingleImage from '../components/SingleImage';
import InputTiled from '../components/InputTiled';
import { millisecondsToSeconds } from 'date-fns';
import { GameInfo, SubmissionDataClassic, SubmissionDataScavengerHunt } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigators/types';
import { useTimer } from '@/hooks';
import { Button } from 'react-native-paper';
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

  const isFinalRound = useMemo(() => round === rounds, [round]);

  const [input, _setInput] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [answers, setAnswers] = useState<{ x: number; y: number }[]>([]);
  const inputRef = useRef(input);

  const setInput = (value: { x: number; y: number }) => {
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
      <MarkableImage
        imageSource={currentImageSource}
        style={{ marginTop: 32 }}
        onValueChange={setInput}
      />
    </ScrollingScreen>
  );
};

export default ScavengerHunt;

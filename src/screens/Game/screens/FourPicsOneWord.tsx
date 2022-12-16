import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { millisecondsToSeconds } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import { Button, ScrollingScreen } from '@/components';
import useTimer from '@/hooks/useTimer';
import { GameInfo, SubmissionDataFourPicsOneWord } from '@/types';
import { RootStackScreenProps } from '@/navigators/types';

import GameCounter from '../components/GameCounter';
import Timer from '../components/Timer';
import InputTiled from '../components/InputTiled';
import FourImages from '../components/FourImages';

interface Props {
  game: GameInfo;
  imageSources: string[];
  onSubmit?:
    | ((data: SubmissionDataFourPicsOneWord, time: number) => void)
    | ((data: SubmissionDataFourPicsOneWord, time: number) => Promise<void>);
}

const FourPicsOneWord = ({ game, imageSources, onSubmit }: Props) => {
  const { data, type, rounds, seconds } = game;
  const { time, startTimer, stopTimer } = useTimer(seconds * 1000);

  if (type !== 'fourpicsoneword') {
    return null;
  }

  useLayoutEffect(() => {
    startTimer();

    return () => stopTimer();
  }, []);

  const [input, _setInput] = useState('');
  const inputRef = useRef(input);
  const setInput = (value: string) => {
    inputRef.current = value;
    _setInput(value);
  };
  const [answers, _setAnswers] = useState<string[]>([]);
  const answersRef = useRef(answers);
  const setAnswers = (value: string[]) => {
    answersRef.current = value;
    _setAnswers(value);
  };

  const [currentRound, setCurrentRound] = useState(1);
  const isFinalRound = useMemo(() => currentRound === rounds, [currentRound, rounds]);

  const currentGameItem = useMemo(() => data[currentRound - 1], [data, currentRound]);
  const currentImageSources = useMemo(
    () => imageSources.slice((currentRound - 1) * 4, currentRound * 4),
    [imageSources, currentRound]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePress = useCallback(async () => {
    if (isFinalRound) {
      try {
        const data: SubmissionDataFourPicsOneWord = answersRef.current
          .concat([inputRef.current])
          .map((answer) => ({ answer }));
        setIsSubmitting(true);
        await onSubmit?.(data, time);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const newAnswers = answersRef.current.concat([inputRef.current]);
    setCurrentRound((round) => round + 1);
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
        currentRound={currentRound}
        totalRounds={game.rounds}
        style={{ alignSelf: 'flex-end', marginRight: 16 }}
      />
      <Timer seconds={millisecondsToSeconds(time)} style={{ marginTop: 32, alignSelf: 'center' }} />
      <FourImages sources={currentImageSources} style={{ marginTop: 32 }} />
      <InputTiled
        length={currentGameItem.word.length}
        value={input}
        onChange={setInput}
        style={{ marginTop: 16, flex: 1 }}
      />
    </ScrollingScreen>
  );
};

export default FourPicsOneWord;

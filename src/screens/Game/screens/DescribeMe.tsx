import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MaterialHeaderButtons, ScrollingScreen } from '@/components';
import GameCounter from '../components/GameCounter';
import Timer from '../components/Timer';
import SingleImage from '../components/SingleImage';
import useTimer from '@/hooks/useTimer';
import { millisecondsToSeconds } from 'date-fns';
import { GameInfo } from '@/types/game';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigators/types';
import { Item } from 'react-navigation-header-buttons';
import FourChoices from '../components/FourChoices';
import { SubmissionDataDescribeMe } from '@/types';

interface Props {
  game: GameInfo;
  images: string[];
  onSubmit?:
    | ((answers: SubmissionDataDescribeMe, time: number) => void)
    | ((answers: SubmissionDataDescribeMe, time: number) => Promise<void>);
}

const DescribeMe = ({ game, images, onSubmit }: Props) => {
  const { data, type, rounds, seconds } = game;
  const { time, startTimer, stopTimer } = useTimer(seconds * 1000);

  if (type !== 'describeme') {
    throw new Error('Game Type must be "classic"');
  }

  useLayoutEffect(() => {
    startTimer();

    return () => stopTimer();
  }, []);

  const [value, _setValue] = useState<string[]>([]);
  const valueRef = useRef(value);
  const [currentRound, setCurrentRound] = useState(1);
  const isFinalRound = useMemo(() => currentRound === rounds, [currentRound, rounds]);
  const [answers, _setAnswers] = useState<string[][]>([]);
  const answersRef = useRef(answers);

  const setValue = (value: string[]) => {
    valueRef.current = value;
    _setValue(value);
  };

  const setAnswers = (value: string[][]) => {
    answersRef.current = value;
    _setAnswers(value);
  };

  const currentGameItem = useMemo(() => data[currentRound - 1], [data, currentRound]);
  const currentImageSource = useMemo(() => images[currentRound - 1], [images, currentRound]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePress = useCallback(async () => {
    if (isFinalRound) {
      try {
        const data: SubmissionDataDescribeMe = answersRef.current
          .concat([valueRef.current])
          .map((answers) => ({ answers }));
        setIsSubmitting(true);
        await onSubmit?.(data, time);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const newAnswers = answersRef.current.concat([valueRef.current]);
    setAnswers(newAnswers);
    setCurrentRound((round) => round + 1);
    setValue([]);
  }, [isFinalRound]);

  const navigation = useNavigation<RootStackScreenProps<'Game'>['navigation']>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialHeaderButtons>
          <Item
            title={isFinalRound ? 'Submit' : 'Next'}
            onPress={handlePress}
            disabled={isSubmitting}
          />
        </MaterialHeaderButtons>
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
      <SingleImage source={currentImageSource} style={{ marginTop: 32 }} />
      <FourChoices
        values={currentGameItem.choices}
        value={value}
        onValueChange={setValue}
        style={{ marginTop: 16, flex: 1 }}
      />
    </ScrollingScreen>
  );
};

export default DescribeMe;

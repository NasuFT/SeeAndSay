import React, {
  Reducer,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { millisecondsToSeconds } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { Item } from 'react-navigation-header-buttons';

import { Button, MaterialHeaderButtons, ScrollingScreen } from '@/components';
import useTimer from '@/hooks/useTimer';
import { GameInfo } from '@/types/game';
import { SubmissionDataDescribeMe } from '@/types';
import { RootStackScreenProps } from '@/navigators/types';

import GameCounter from '../components/GameCounter';
import Timer from '../components/Timer';
import SingleImage from '../components/SingleImage';
import FourChoices from '../components/FourChoices';
import { Text } from 'react-native-paper';

interface Props {
  game: GameInfo;
  images: string[];
  onSubmit?:
    | ((answers: SubmissionDataDescribeMe, time: number) => void)
    | ((answers: SubmissionDataDescribeMe, time: number) => Promise<void>);
}

interface GameState {
  input: string[];
  answers: string[][];
}

type Action =
  | {
      type: 'SET_INPUT';
      payload: string[];
    }
  | { type: 'USE_INPUT' };

const gameStateReducer = (state: GameState, action: Action): GameState => {
  if (action.type === 'SET_INPUT') {
    return {
      ...state,
      input: action.payload,
    };
  } else {
    return {
      ...state,
      input: [],
      answers: state.answers.concat([state.input]),
    };
  }
};

const DescribeMe = ({ game, images, onSubmit }: Props) => {
  const { data, type, rounds, seconds } = game;
  const { time, startTimer, stopTimer } = useTimer(seconds * 1000);

  if (type !== 'describeme') {
    throw new Error('Game Type must be "describeme"');
  }

  useLayoutEffect(() => {
    startTimer();

    return () => stopTimer();
  }, []);

  const [gameState, dispatch] = useReducer<Reducer<GameState, Action>>(gameStateReducer, {
    input: [],
    answers: [],
  });

  const [currentRound, setCurrentRound] = useState(1);
  const isFinalRound = useMemo(() => currentRound === rounds, [currentRound, rounds]);

  const currentGameItem = useMemo(() => data[currentRound - 1], [data, currentRound]);
  const currentImageSource = useMemo(() => images[currentRound - 1], [images, currentRound]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePress = useCallback(async () => {
    dispatch({ type: 'USE_INPUT' });
    if (!isFinalRound) {
      setCurrentRound((round) => round + 1);
    }
  }, [isFinalRound]);

  useEffect(() => {
    if (gameState.answers.length === rounds) {
      const cb = async () => {
        try {
          const data: SubmissionDataDescribeMe = gameState.answers.map((answers) => ({
            answers,
          }));
          setIsSubmitting(true);
          await onSubmit?.(data, time);
        } finally {
          setIsSubmitting(false);
        }
      };

      cb();
    }
  }, [gameState.answers, rounds]);

  return (
    <ScrollingScreen withBackground contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          justifyContent: 'center',
          zIndex: 1,
          minHeight: 128,
          flex: 1,
        }}>
        <Timer
          seconds={millisecondsToSeconds(time)}
          style={{ marginVertical: 16, alignSelf: 'center' }}
        />
        <View
          style={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}>
          <GameCounter
            currentRound={currentRound}
            totalRounds={rounds}
            style={{ alignSelf: 'flex-end' }}
          />
          <Button
            icon={isFinalRound ? 'send' : 'arrow-right-bold-outline'}
            disabled={isSubmitting}
            loading={isSubmitting}
            style={{ borderRadius: 8, marginTop: 16 }}
            mode="contained"
            onPress={handlePress}>
            {isFinalRound ? 'Submit' : 'Next'}
          </Button>
        </View>
      </View>
      <SingleImage
        source={currentImageSource}
        style={{ borderWidth: 4, borderColor: '#facd89', backgroundColor: '#3c5e47' }}
      />
      <FourChoices
        values={currentGameItem.choices}
        value={gameState.input}
        onValueChange={(value) => {
          dispatch({ type: 'SET_INPUT', payload: value });
        }}
        style={{ flex: 1 }}
      />
    </ScrollingScreen>
  );
};

export default DescribeMe;

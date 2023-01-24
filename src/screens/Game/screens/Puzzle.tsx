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
import { millisecondsToSeconds } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';

import { ScrollingScreen } from '@/components';
import { GameInfo, SubmissionDataPuzzle } from '@/types';
import { RootStackScreenProps } from '@/navigators/types';
import { useTimer } from '@/hooks';

import GameCounter from '../components/GameCounter';
import Timer from '../components/Timer';
import SortableSplitImage from '../components/SortableSplitImage';
import { View } from 'react-native';

interface Props {
  game: GameInfo;
  images: string[];
  onSubmit?:
    | ((answers: SubmissionDataPuzzle, time: number) => void)
    | ((answers: SubmissionDataPuzzle, time: number) => Promise<void>);
}

interface GameState {
  input: number[];
  answers: number[][];
}

type Action =
  | {
      type: 'SET_INPUT';
      payload: number[];
    }
  | {
      type: 'USE_INPUT';
    };

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

const Puzzle = ({ game, images, onSubmit }: Props) => {
  const { type, data, seconds, rounds } = game;
  if (type !== 'puzzle') {
    throw new Error('Game Type must be "puzzle"');
  }

  const { time, startTimer, stopTimer } = useTimer(seconds * 1000);

  const [round, setRound] = useState(1);
  const currentGameItem = useMemo(() => data[round - 1], [data, round]);
  const currentImageSource = useMemo(() => images[round - 1], [images, round]);

  const [gameState, dispatch] = useReducer<Reducer<GameState, Action>>(gameStateReducer, {
    input: [],
    answers: [],
  });

  const isFinalRound = useMemo(() => round === rounds, [round]);

  useLayoutEffect(() => {
    startTimer();

    return () => stopTimer();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePress = useCallback(async () => {
    dispatch({ type: 'USE_INPUT' });
    if (!isFinalRound) {
      setRound((round) => round + 1);
    }
  }, [isFinalRound]);

  useEffect(() => {
    if (gameState.answers.length === rounds) {
      const cb = async () => {
        try {
          const data: SubmissionDataPuzzle = gameState.answers.map((answer) => ({
            answer,
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

  useEffect(() => {
    if (time <= 0) {
      const cb = async () => {
        try {
          const data: SubmissionDataPuzzle = gameState.answers.map((answer) => ({ answer }));
          setIsSubmitting(true);
          await onSubmit?.(data, 0);
        } finally {
          setIsSubmitting(false);
        }
      };

      cb();
    }
  }, [time, gameState.answers]);

  return (
    <ScrollingScreen withBackground contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          justifyContent: 'center',
          zIndex: 1,
          minHeight: 128,
          maxHeight: 256,
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
            currentRound={round}
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
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <SortableSplitImage
          size={currentGameItem.size}
          imageSource={currentImageSource}
          onValueChange={(value) => {
            dispatch({ type: 'SET_INPUT', payload: value });
          }}
          containerStyle={{ margin: 4 }}
          style={{
            borderWidth: 4,
            borderColor: '#facd89',
            backgroundColor: '#3c5e47',
            marginHorizontal: 8,
          }}
        />
      </View>
    </ScrollingScreen>
  );
};

export default Puzzle;

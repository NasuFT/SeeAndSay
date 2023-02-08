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

type ScavengerHuntData = {
  x: number;
  y: number;
};

interface GameState {
  input: ScavengerHuntData;
  answers: ScavengerHuntData[];
}

type Action =
  | {
      type: 'SET_INPUT';
      payload: ScavengerHuntData;
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
      input: { x: 0, y: 0 },
      answers: state.answers.concat([state.input]),
    };
  }
};

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

  const [gameState, dispatch] = useReducer<Reducer<GameState, Action>>(gameStateReducer, {
    input: { x: 0, y: 0 },
    answers: [],
  });

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
          const data: SubmissionDataScavengerHunt = gameState.answers.map((answer) => ({
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
    if (time <= 0 && !isSubmitting) {
      const cb = async () => {
        try {
          const data: SubmissionDataScavengerHunt = gameState.answers.map((answer) => ({ answer }));
          setIsSubmitting(true);
          await onSubmit?.(data, 0);
        } finally {
          setIsSubmitting(false);
        }
      };

      cb();
    }
  }, [time, gameState.answers, isSubmitting]);

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
      <View style={{ flex: 1, justifyContent: 'space-around' }}>
        <MarkableImage
          imageSource={currentImageSource}
          onValueChange={(value) => {
            dispatch({ type: 'SET_INPUT', payload: value });
          }}
          style={{
            borderWidth: 4,
            borderColor: '#facd89',
            backgroundColor: '#3c5e47',
            marginHorizontal: 8,
          }}
        />
        <Text
          variant="titleMedium"
          style={{
            textAlign: 'center',
            color: '#ffffff',
            includeFontPadding: false,
            textAlignVertical: 'center',
            borderWidth: 4,
            borderColor: '#facd89',
            backgroundColor: '#3c5e47',
            alignSelf: 'center',
            paddingVertical: 4,
            paddingHorizontal: 8,
          }}>
          {currentGameItem.description}
        </Text>
      </View>
    </ScrollingScreen>
  );
};

export default ScavengerHunt;

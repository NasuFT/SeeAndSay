import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  Reducer,
} from 'react';
import { millisecondsToSeconds } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { Button, Text } from 'react-native-paper';

import { ScrollingScreen } from '@/components';
import { GameInfo, SubmissionDataClassic } from '@/types';
import { RootStackScreenProps } from '@/navigators/types';
import { useTimer } from '@/hooks';

import GameCounter from '../components/GameCounter';
import Timer from '../components/Timer';
import SingleImage from '../components/SingleImage';
import InputTiled from '../components/InputTiled';
import SpeechToTextSuggest from '../components/SpeechToTextSuggest';
import { useEffect } from 'react';

interface Props {
  game: GameInfo;
  images: string[];
  onSubmit?:
    | ((answers: SubmissionDataClassic, time: number) => void)
    | ((answers: SubmissionDataClassic, time: number) => Promise<void>);
}

type GameState = {
  input: string;
  answers: string[];
  suggestion: string;
};

type Action =
  | {
      type: 'SET_INPUT' | 'SET_SUGGESTION';
      payload: string;
    }
  | {
      type: 'USE_INPUT' | 'USE_SUGGESTION';
    };

const gameStateReducer = (state: GameState, action: Action): GameState => {
  if (action.type === 'SET_INPUT') {
    return {
      ...state,
      input: action.payload,
    };
  } else if (action.type === 'SET_SUGGESTION') {
    return {
      ...state,
      suggestion: action.payload,
    };
  } else if (action.type === 'USE_SUGGESTION') {
    return {
      ...state,
      input: state.suggestion,
      suggestion: '',
    };
  } else {
    return {
      ...state,
      input: '',
      suggestion: '',
      answers: state.answers.concat([state.input]),
    };
  }
};

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

  const [gameState, dispatch] = useReducer<Reducer<GameState, Action>>(gameStateReducer, {
    input: '',
    answers: [],
    suggestion: '',
  });

  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  useLayoutEffect(() => {
    startTimer();

    return () => stopTimer();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePress = useCallback(() => {
    dispatch({ type: 'USE_INPUT' });
    if (!isFinalRound) {
      setRound((round) => round + 1);
    }
  }, [isFinalRound]);

  useEffect(() => {
    if (gameState.answers.length === rounds) {
      const cb = async () => {
        try {
          const data: SubmissionDataClassic = gameState.answers.map((answer) => ({ answer }));
          setIsSubmitting(true);
          await onSubmit?.(data, time);
        } finally {
          setIsSubmitting(false);
        }
      };

      cb();
    }
  }, [gameState.answers, rounds]);

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
      <Text
        variant="bodyLarge"
        style={{ marginTop: 16, marginHorizontal: 16, textAlign: 'center' }}>{`Language: ${
        currentGameItem.language === 'ph' ? 'Filipino' : 'English'
      }`}</Text>
      <SingleImage source={currentImageSource} style={{ marginTop: 16 }} />
      <InputTiled
        length={currentGameItem.word.length}
        value={gameState.input}
        onChange={(value) => dispatch({ type: 'SET_INPUT', payload: value.toLowerCase() })}
        style={{ marginTop: 16, flex: 1 }}
      />
      <SpeechToTextSuggest
        onValueChange={(value) => dispatch({ type: 'SET_SUGGESTION', payload: value })}
        style={{ marginHorizontal: 16 }}
      />
      <Button
        mode="contained"
        style={{ alignSelf: 'stretch', margin: 16 }}
        onPress={() => {
          dispatch({ type: 'USE_SUGGESTION' });
        }}>
        Use Suggested Word
      </Button>
    </ScrollingScreen>
  );
};

export default Classic;

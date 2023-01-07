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

import { Button, ScrollingScreen } from '@/components';
import useTimer from '@/hooks/useTimer';
import { GameInfo, SubmissionDataFourPicsOneWord } from '@/types';
import { RootStackScreenProps } from '@/navigators/types';

import GameCounter from '../components/GameCounter';
import Timer from '../components/Timer';
import InputTiled from '../components/InputTiled';
import FourImages from '../components/FourImages';
import SpeechToTextSuggest from '../components/SpeechToTextSuggest';
import { Text } from 'react-native-paper';

interface Props {
  game: GameInfo;
  imageSources: string[];
  onSubmit?:
    | ((data: SubmissionDataFourPicsOneWord, time: number) => void)
    | ((data: SubmissionDataFourPicsOneWord, time: number) => Promise<void>);
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

  const [gameState, dispatch] = useReducer<Reducer<GameState, Action>>(gameStateReducer, {
    input: '',
    suggestion: '',
    answers: [],
  });

  const [currentRound, setCurrentRound] = useState(1);
  const isFinalRound = useMemo(() => currentRound === rounds, [currentRound, rounds]);

  const currentGameItem = useMemo(() => data[currentRound - 1], [data, currentRound]);
  const currentImageSources = useMemo(
    () => imageSources.slice((currentRound - 1) * 4, currentRound * 4),
    [imageSources, currentRound]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePress = useCallback(() => {
    dispatch({ type: 'USE_INPUT' });
    if (!isFinalRound) {
      setCurrentRound((round) => round + 1);
    }
  }, [isFinalRound]);

  useEffect(() => {
    if (gameState.answers.length === rounds) {
      const cb = async () => {
        try {
          const data: SubmissionDataFourPicsOneWord = gameState.answers.map((answer) => ({
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
      <Text
        variant="titleMedium"
        style={{ marginTop: 16, marginHorizontal: 16, textAlign: 'center' }}>{`Language: ${
        currentGameItem.language === 'ph' ? 'Filipino' : 'English'
      }`}</Text>
      <FourImages sources={currentImageSources} style={{ marginTop: 16 }} />
      <InputTiled
        length={currentGameItem.word.length}
        value={gameState.input}
        onChange={(value) => {
          dispatch({ type: 'SET_INPUT', payload: value });
        }}
        style={{ marginTop: 16, flex: 1 }}
      />
      <SpeechToTextSuggest
        onValueChange={(value) => {
          dispatch({ type: 'SET_SUGGESTION', payload: value });
        }}
      />
      <Button
        mode="contained"
        style={{ alignSelf: 'stretch' }}
        onPress={() => {
          dispatch({ type: 'USE_SUGGESTION' });
        }}>
        Use Suggested Word
      </Button>
    </ScrollingScreen>
  );
};

export default FourPicsOneWord;

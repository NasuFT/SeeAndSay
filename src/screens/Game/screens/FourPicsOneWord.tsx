import React, {
  Reducer,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { View } from 'react-native';
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

  useEffect(() => {
    if (time <= 0 && !isSubmitting) {
      const cb = async () => {
        try {
          const data: SubmissionDataFourPicsOneWord = gameState.answers.map((answer) => ({
            answer,
          }));
          setIsSubmitting(true);
          await onSubmit?.(data, 0);
        } finally {
          setIsSubmitting(false);
        }
      };

      cb();
    }
  }, [time, gameState.answers, isSubmitting]);

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
            totalRounds={game.rounds}
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
      <View>
        <FourImages
          sources={currentImageSources}
          style={{ borderWidth: 4, borderColor: '#facd89', backgroundColor: '#3c5e47' }}
        />
        <Text
          variant="titleMedium"
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            includeFontPadding: false,
            borderWidth: 4,
            borderColor: '#facd89',
            backgroundColor: '#3c5e47',
            color: '#ffffff',
            alignSelf: 'center',
            marginTop: 8,
            paddingVertical: 4,
            paddingHorizontal: 12,
          }}>{`Language: ${currentGameItem.language === 'ph' ? 'Filipino' : 'English'}`}</Text>
      </View>
      <InputTiled
        length={currentGameItem.word.length}
        value={gameState.input}
        onChange={(value) => {
          dispatch({ type: 'SET_INPUT', payload: value });
        }}
        style={{ flex: 1 }}
      />
      <View>
        <SpeechToTextSuggest
          onValueChange={(value) => {
            dispatch({ type: 'SET_SUGGESTION', payload: value });
          }}
          style={{ marginHorizontal: 16 }}
        />
        <Button
          mode="contained"
          style={{ alignSelf: 'stretch', marginHorizontal: 16, marginBottom: 16, marginTop: 8 }}
          onPress={() => {
            dispatch({ type: 'USE_SUGGESTION' });
          }}>
          Use Suggested Word
        </Button>
      </View>
    </ScrollingScreen>
  );
};

export default FourPicsOneWord;

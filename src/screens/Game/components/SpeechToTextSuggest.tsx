import { useEffect, useReducer, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Voice from '@react-native-voice/voice';
import { IconButton, Text } from 'react-native-paper';

interface Props {
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

interface VoiceState {
  suggestion: string;
  isRecognizerAvailable: boolean;
  status: 'ERROR' | 'RECOGNIZING' | 'PROCESSING' | 'STANDBY';
  error?: string;
}

type Action =
  | {
      type: 'SET_SUGGESTION' | 'SET_ERROR';
      payload: string;
    }
  | {
      type: 'SET_RECOGNIZER_UNAVAILABLE' | 'SET_PROCESSING' | 'SET_RECOGNIZING' | 'SET_STANDBY';
    };

const voiceStateReducer = (state: VoiceState, action: Action): VoiceState => {
  if (action.type === 'SET_SUGGESTION') {
    return {
      ...state,
      suggestion: action.payload,
      status: 'STANDBY',
      error: undefined,
    };
  }

  if (action.type === 'SET_ERROR') {
    return {
      ...state,
      status: 'ERROR',
      error: action.payload,
    };
  }

  if (action.type === 'SET_RECOGNIZER_UNAVAILABLE') {
    return {
      ...state,
      isRecognizerAvailable: false,
      status: 'ERROR',
      error: 'No voice recognizer found! Please install Google App.',
    };
  }

  if (action.type === 'SET_PROCESSING') {
    return {
      ...state,
      status: 'PROCESSING',
      error: undefined,
    };
  }

  if (action.type === 'SET_STANDBY') {
    return {
      ...state,
      status: 'STANDBY',
      error: undefined,
    };
  }

  // SET_RECOGNIZING
  return {
    ...state,
    status: 'RECOGNIZING',
    error: undefined,
  };
};

const initialVoiceState: VoiceState = {
  suggestion: '',
  isRecognizerAvailable: true,
  status: 'STANDBY',
  error: undefined,
};

const SpeechToTextSuggest = ({ onValueChange, style }: Props) => {
  const [selected, setSelected] = useState(false);
  const [voiceState, dispatch] = useReducer(voiceStateReducer, initialVoiceState);

  const pressHandler = () => setSelected((selected) => !selected);

  useEffect(() => {
    if (selected) {
      Voice.start('en-PH', {
        EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 300,
      });
    } else {
      Voice.isRecognizing().then((isRecognizing) => {
        if (isRecognizing) {
          Voice.cancel();
        }
      });
    }
  }, [selected]);

  useEffect(() => {
    const checkRecognizers = async () => {
      const isAvailable = await Voice.isAvailable();

      if (!isAvailable) {
        dispatch({ type: 'SET_RECOGNIZER_UNAVAILABLE' });
      }

      const speechRecognizers = await Voice.getSpeechRecognitionServices();

      if (
        !speechRecognizers ||
        !speechRecognizers.includes('com.google.android.googlequicksearchbox')
      ) {
        dispatch({ type: 'SET_RECOGNIZER_UNAVAILABLE' });
      }
    };

    checkRecognizers();

    Voice.onSpeechStart = () => {
      dispatch({ type: 'SET_RECOGNIZING' });
    };

    Voice.onSpeechEnd = (e) => {
      dispatch({ type: 'SET_PROCESSING' });
      setSelected(false);
    };

    Voice.onSpeechResults = (e) => {
      const result = e.value;
      if (result && result.length > 0) {
        dispatch({
          type: 'SET_SUGGESTION',
          payload: result.find((word) => word.split(' ').length === 1) ?? '',
        });
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    onValueChange?.(voiceState.suggestion);
  }, [voiceState.suggestion]);

  return (
    <View style={style}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, marginVertical: 16 }}>
          <Text variant="bodyMedium">
            {voiceState.status === 'ERROR'
              ? voiceState.error
              : voiceState.status === 'RECOGNIZING'
              ? 'Listening...'
              : voiceState.status === 'PROCESSING'
              ? 'Processing...'
              : voiceState.suggestion}
          </Text>
        </View>
        <View style={{}}>
          <IconButton
            disabled={!voiceState.isRecognizerAvailable}
            selected={selected}
            icon="microphone"
            mode="contained"
            onPress={pressHandler}
          />
        </View>
      </View>
    </View>
  );
};

export default SpeechToTextSuggest;

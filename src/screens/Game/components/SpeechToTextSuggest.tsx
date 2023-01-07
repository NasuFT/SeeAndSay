import { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Voice from '@react-native-voice/voice';
import { IconButton, Text } from 'react-native-paper';

interface Props {
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

const SpeechToTextSuggest = ({ onValueChange, style }: Props) => {
  const [suggestion, setSuggestion] = useState('');
  const [selected, setSelected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const pressHandler = () => {
    setSelected((selected) => !selected);
  };

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
    Voice.onSpeechEnd = (e) => {
      setIsProcessing(true);
      setSelected(false);
    };

    Voice.onSpeechResults = (e) => {
      const result = e.value;
      console.log(result);
      if (result && result.length > 0) {
        setSuggestion(result.find((word) => word.split(' ').length === 1) ?? '');
      }
      setIsProcessing(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    onValueChange?.(suggestion);
  }, [suggestion]);

  return (
    <View style={style}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, marginVertical: 16 }}>
          <Text variant="bodyMedium">{`Spoken words: ${
            selected ? '<Listening...>' : isProcessing ? '<Processing...>' : suggestion
          }`}</Text>
        </View>
        <View style={{}}>
          <IconButton
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

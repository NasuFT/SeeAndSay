import {
  View,
  StyleProp,
  ViewStyle,
  TextInput,
  Pressable,
  BackHandler,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import InputTile from './InputTile';
import { useFocusEffect } from '@react-navigation/native';
import { isAllLetter } from '@/utils/helper';

interface Props {
  length: number;
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

const InputTiled = ({ style, value, length, onChange }: Props) => {
  const inputRef = useRef<TextInput>(null);

  const toggleFocus = () => {
    const isFocused = inputRef.current?.isFocused();

    if (isFocused) {
      inputRef.current?.blur();
      return;
    }

    inputRef.current?.focus();
  };

  const handleChange = (value: string) => {
    if (!isAllLetter(value)) {
      return;
    }

    onChange(value);
  };

  return (
    <View
      style={[
        {
          justifyContent: 'center',
          alignItems: 'stretch',
          paddingHorizontal: 16,
          paddingVertical: 16,
        },
        style,
      ]}>
      <TextInput
        pointerEvents="none"
        style={{
          width: 1,
          height: 1,
          fontSize: 64,
          position: 'absolute',
          bottom: 0,
        }}
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        maxLength={length}
      />
      <Pressable
        onPress={toggleFocus}
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {Array(length)
          .fill(undefined)
          .map((_, index) => (
            <InputTile
              key={index}
              value={value.charAt(index)}
              style={{ marginLeft: index !== 0 ? 8 : 0 }}
            />
          ))}
      </Pressable>
    </View>
  );
};

export default InputTiled;

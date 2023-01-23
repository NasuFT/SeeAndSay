import { StyleProp, ViewStyle } from 'react-native';
import { useEffect, useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { shuffle } from 'lodash';

interface Props {
  size: number;
  imageSource: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onValueChange?: (value: number[]) => void;
}

const SortableSplitImage = ({ size, imageSource, style, onValueChange, containerStyle }: Props) => {
  const theme = useTheme();

  const startingValue = shuffle(
    [...Array(size * size)].map((_, index) => {
      const x = index % size;
      const y = Math.floor(index / size);

      return { x, y };
    })
  );

  const containerWidth = useSharedValue(0);
  const containerHeight = useSharedValue(0);
  const itemGap = useSharedValue(4);
  const totalPadding = useDerivedValue(() => itemGap.value * (size + 1));
  const itemWidth = useDerivedValue(() => (containerWidth.value - totalPadding.value) / size);
  const itemHeight = useDerivedValue(() => (containerHeight.value - totalPadding.value) / size);
  const points = useSharedValue(startingValue.concat());

  useEffect(() => {
    if (onValueChange) {
      const valueMap = points.value.map((item) => item.y * size + item.x);
      onValueChange(valueMap);
    }
  }, [points.value]);

  const selectedIndex = useSharedValue<number | null>(null);

  const coordToPoint = (x: number, y: number) => {
    'worklet';
    const xIndex = Math.floor(interpolate(x, [0, containerWidth.value], [0, size]));
    const yIndex = Math.floor(interpolate(y, [0, containerHeight.value], [0, size]));

    return {
      x: xIndex,
      y: yIndex,
    };
  };

  const itemStyle = useMemo<ViewStyle>(
    () => ({
      overflow: 'hidden',
      position: 'absolute',
      height: itemHeight.value,
      width: itemWidth.value,
      flexDirection: 'row',
    }),
    [itemHeight.value, itemWidth.value]
  );

  const overlayStyle = useMemo<ViewStyle>(
    () => ({
      backgroundColor: 'black',
      position: 'absolute',
      width: itemWidth.value,
      height: itemHeight.value,
    }),
    [itemWidth.value, itemHeight.value]
  );

  const offsets = [...Array(size * size)].map((_, index) =>
    useAnimatedStyle(() => {
      const { x, y } = points.value[index];

      const top = withTiming((y + 1) * itemGap.value + y * itemHeight.value);
      const left = withTiming((x + 1) * itemGap.value + x * itemWidth.value);

      return {
        top,
        left,
      };
    })
  );

  const overlayAnimatedStyles = [...Array(size * size)].map((_, index) =>
    useAnimatedStyle(() => {
      const isSelected = index === selectedIndex.value;

      return {
        opacity: isSelected
          ? withRepeat(
              withSequence(
                withTiming(0.6, { duration: 600 }),
                withTiming(0, { duration: 600 }),
                withTiming(0, { duration: 300 })
              ),
              -1
            )
          : 0,
      };
    })
  );

  const imageTransforms = [...Array(size * size)].map((_, index) =>
    useAnimatedStyle(() => {
      const rowIndex = index % size;
      const colIndex = Math.floor(index / size);

      const multiplier = 0.5 - 1 / (size * 2);

      return {
        transform: [
          {
            scale: size,
          },
          {
            translateX: interpolate(
              rowIndex,
              [0, size - 1],
              [itemWidth.value * multiplier, -itemWidth.value * multiplier]
            ),
          },
          {
            translateY: interpolate(
              colIndex,
              [0, size - 1],
              [itemHeight.value * multiplier, -itemHeight.value * multiplier]
            ),
          },
        ],
      };
    })
  );

  const tapGesture = Gesture.Tap().onEnd((e) => {
    const { x, y } = e;

    const point = coordToPoint(x, y);
    const index = points.value.findIndex((item) => item.x === point.x && item.y === point.y);

    if (selectedIndex.value === null) {
      selectedIndex.value = index;
    } else if (selectedIndex.value === index) {
      selectedIndex.value = null;
    } else {
      const prevIndex = selectedIndex.value;

      const newPoints = points.value.slice();
      newPoints[index] = points.value[prevIndex];
      newPoints[prevIndex] = points.value[index];
      points.value = newPoints;

      selectedIndex.value = null;
    }
  });

  return (
    <Animated.View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
        },
        style,
      ]}>
      <GestureDetector gesture={tapGesture}>
        <Animated.View
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            containerWidth.value = width;
            containerHeight.value = height;
          }}
          style={[{ flex: 1, aspectRatio: 1 }, containerStyle]}>
          {[...Array(size * size)].map((_, index) => {
            return (
              <Animated.View key={index} style={[itemStyle, offsets[index]]}>
                <Animated.Image
                  source={{ uri: imageSource }}
                  style={[{ flex: 1, aspectRatio: 1 }, imageTransforms[index]]}
                />
                <Animated.View style={[overlayStyle, overlayAnimatedStyles[index]]} />
              </Animated.View>
            );
          })}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export default SortableSplitImage;

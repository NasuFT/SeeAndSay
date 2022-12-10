import { StyleProp, ViewStyle, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  clampScale,
  clampTranslation,
  concat,
  getScaleFactor,
  mulmat4vec3,
  vec3,
} from '@/utils/matrixhelper';
import {
  identity4,
  multiply4,
  Matrix4,
  Vec3,
  matrixVecMul4,
  Vec4,
  processTransform3d,
  Vec2,
} from 'react-native-redash';
import { useEffect } from 'react';

interface Answer {
  x: number;
  y: number;
}

const MIN_SCALE = 1;
const MAX_SCALE = 10;

interface Props {
  imageSource: string;
  style?: StyleProp<ViewStyle>;
  onValueChange?: (value: Answer) => void;
}

const MarkableImage = ({ imageSource, style, onValueChange }: Props) => {
  const theme = useTheme();

  const containerWidth = useSharedValue(0);
  const containerHeight = useSharedValue(1);

  const matrix = useSharedValue(identity4);
  const target = useSharedValue<Vec2 | null>(null);
  const origin = useSharedValue(vec3(0, 0, 0));
  const offset = useSharedValue(identity4);

  useEffect(() => {
    if (onValueChange && target.value) {
      const [x, y] = target.value;
      onValueChange({
        x,
        y,
      });
    }
  }, [target.value]);

  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      offset.value = matrix.value;
      origin.value = [e.focalX, e.focalY, 0];
    })
    .onChange((e) => {
      matrix.value = concat(offset.value, origin.value, [{ scale: e.scale }]);
    })
    .onEnd(() => {
      const newMatrix = clampTranslation(
        clampScale(matrix.value, MIN_SCALE, MAX_SCALE),
        containerWidth.value,
        containerHeight.value
      );

      matrix.value = withTiming(newMatrix as unknown as number[]) as unknown as Matrix4;
    });

  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .onChange((e) => {
      matrix.value = multiply4(Matrix4.translate(e.changeX, e.changeY, 0), matrix.value);
    })
    .onEnd(() => {
      const newMatrix = clampTranslation(matrix.value, containerWidth.value, containerHeight.value);

      matrix.value = withTiming(newMatrix as unknown as number[]) as unknown as Matrix4;
    });

  const tapGesture = Gesture.Tap().onEnd((e) => {
    const m = matrix.value;

    const scale = m[0];
    const x = e.x - m[12];
    const y = e.y - m[13];

    const targetX = interpolate(x, [0, containerWidth.value * scale], [-100, 100]);
    const targetY = interpolate(y, [0, containerHeight.value * scale], [100, -100]);

    target.value = [targetX, targetY];
  });

  const imageTransform = useAnimatedStyle(() => ({
    transform: [
      { translateX: -containerWidth.value / 2 },
      { translateY: -containerHeight.value / 2 },
      { matrix: matrix.value as unknown as number[] },
      { translateX: containerWidth.value / 2 },
      { translateY: containerHeight.value / 2 },
    ],
  }));

  const targetTransform = useAnimatedStyle(() =>
    target.value === null
      ? { display: 'none' }
      : {
          transform: [
            { matrix: matrix.value as unknown as number[] },
            { translateX: interpolate(target.value[0], [-100, 100], [0, containerWidth.value]) },
            { translateY: interpolate(target.value[1], [100, -100], [0, containerHeight.value]) },
          ],
        }
  );

  return (
    <View style={[{ flex: 1, alignItems: 'center', flexDirection: 'row' }, style]}>
      <GestureDetector gesture={Gesture.Race(panGesture, pinchGesture, tapGesture)}>
        <Animated.View
          style={{
            aspectRatio: 1,
            backgroundColor: theme.colors.primaryContainer,
            marginHorizontal: 16,
            flex: 1,
            overflow: 'hidden',
          }}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            console.log(width, height);
            containerWidth.value = width;
            containerHeight.value = height;
          }}>
          <Animated.Image
            source={{ uri: imageSource }}
            style={[{ flex: 1 }, imageTransform]}
            resizeMode="contain"
          />
          <Animated.View
            style={[
              {
                position: 'absolute',
                backgroundColor: 'red',
                height: 20,
                width: 20,
                borderRadius: 9999,
                transform: [
                  {
                    translateX: -10,
                  },
                  {
                    translateY: -10,
                  },
                ],
              },
              targetTransform,
            ]}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default MarkableImage;

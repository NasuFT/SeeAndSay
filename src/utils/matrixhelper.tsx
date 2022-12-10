import {
  Matrix4,
  clamp,
  Vec3,
  Transforms3d,
  multiply4,
  processTransform3d,
  Vec4,
} from 'react-native-redash';

export const getScaleFactor = (m: Matrix4) => {
  'worklet';
  return m[0];
};

export const clampScale = (m: Matrix4, minScale: number, maxScale: number) => {
  'worklet';

  const scale = getScaleFactor(m);
  const newMatrix = [...m];

  const newScale = scale < minScale ? minScale : scale > maxScale ? maxScale : scale;
  newMatrix[0] = newScale;
  newMatrix[5] = newScale;

  return newMatrix as unknown as Matrix4;
};

export const clampTranslation = (m: Matrix4, containerWidth: number, containerHeight: number) => {
  'worklet';
  const [x, y] = [m[12], m[13]];
  const scale = getScaleFactor(m);

  const minLimitX = -(containerWidth * (scale - 1));
  const minLimitY = -(containerHeight * (scale - 1));
  const maxLimitX = 0;
  const maxLimitY = 0;

  const newX = clamp(x, minLimitX, maxLimitX);
  const newY = clamp(y, minLimitY, maxLimitY);

  const newMatrix = [...m];
  newMatrix[12] = newX;
  newMatrix[13] = newY;

  return newMatrix as unknown as Matrix4;
};

export const vec3 = (x: number, y: number, z: number) => [x, y, z] as const;

export const transformOrigin3d = (origin: Vec3, transform: Transforms3d): Transforms3d => {
  'worklet';
  return [
    { translateX: origin[0] },
    { translateY: origin[1] },
    { translateZ: origin[2] },
    ...transform,
    { translateX: -origin[0] },
    { translateY: -origin[1] },
    { translateZ: -origin[2] },
  ];
};

export const mulmat4vec3 = (m: Matrix4, v: Vec3): Vec4 => {
  'worklet';
  const [v1, v2, v3] = v;

  const r: Vec4 = [
    m[0] * v1 + m[4] * v2 + m[8] * v3 + m[12],
    m[1] * v1 + m[5] * v2 + m[9] * v3 + m[13],
    m[2] * v1 + m[6] * v2 + m[10] * v3 + m[14],
    m[3] * v1 + m[7] * v2 + m[11] * v3 + m[15],
  ];

  return r;
};

export const concat = (m: Matrix4, origin: Vec3, transform: Transforms3d) => {
  'worklet';
  return multiply4(m, processTransform3d(transformOrigin3d(origin, transform)));
};

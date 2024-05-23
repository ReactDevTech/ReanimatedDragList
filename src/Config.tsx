import {Dimensions} from 'react-native';
import {Easing} from 'react-native-reanimated';

export interface Positions {
  [id: number]: number;
}

const {width} = Dimensions.get('window');
export const MARGIN = 0;
export const SIZE = width / 4 - MARGIN;
export const COL = 1;

export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 350,
};

export const getPosition = (position: number, itemSeprateHeight: number) => {
  'worklet';

  return {
    x: position % COL === 0 ? 0 : SIZE * (position % COL),
    y: Math.floor((position - 1) / COL) * (SIZE + itemSeprateHeight),
  };
};

export const getOrder = (tx: number, ty: number, max: number) => {
  'worklet';

  const x = Math.round(tx / SIZE) * SIZE;
  const y = Math.round(ty / SIZE) * SIZE;
  const row = Math.max(y, 0) / SIZE;
  const col = Math.max(x, 0) / SIZE;
  return Math.min(row * COL + col, max);
};

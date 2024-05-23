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

export const getPosition = (position: number, itemSeprateHeight: number,itemHeight:number) => {
  'worklet';

  return {
    x: position % COL === 0 ? 0 : itemHeight * (position % COL),
    y: Math.floor((position - 1) / COL) * (itemHeight + itemSeprateHeight),
  };
};

export const getOrder = (tx: number, ty: number, max: number,itemHeight:number) => {
  'worklet';

  const x = Math.round(tx / itemHeight) * itemHeight;
  const y = Math.round(ty / itemHeight) * itemHeight;
  const row = Math.max(y, 0) / itemHeight;
  const col = Math.max(x, 0) / itemHeight;
  return Math.min(row * COL + col, max);
};

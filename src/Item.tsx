import React, {ReactNode, RefObject} from 'react';
import {Alert, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  scrollTo,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  animationConfig,
  COL,
  getOrder,
  getPosition,
  Positions,
  SIZE,
} from './Config';

interface ItemProps {
  positions?: any;
  editing?: boolean;
  onDragEnd?: (newArray: Array<object>) => void; // Modify onDragEnd prop to accept old and new indices
  scrollView?: any;
  scrollY: any;
  item?: any;
  index?: number;
  itemSeparateHeight?: number;
  renderItem: ({item, index}: {item: any; index: any}) => React.ReactNode;
  oldData?: Array<object>;
  onLongPress?:()=>void
  onPressOut?:()=>void
}

const Item = ({
  positions,
  onDragEnd,
  scrollView,
  scrollY,
  editing,
  item,
  index,
  itemSeparateHeight = 0,
  renderItem,
  oldData = [],
  onLongPress,
  onPressOut
}: ItemProps) => {
  const inset = useSafeAreaInsets();
  const containerHeight =
    Dimensions.get('window').height - inset.top - inset.bottom;
  const contentHeight = (Object.keys(positions.value).length / COL) * SIZE;
  const isGestureActive = useSharedValue(false);

  const position = getPosition(positions.value[item?.id]!, itemSeparateHeight);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);

  useAnimatedReaction(
    () => positions.value[item?.id]!,
    newOrder => {
      if (!isGestureActive.value) {
        const pos = getPosition(newOrder, itemSeparateHeight);
        translateX.value = withTiming(pos.x, animationConfig);
        translateY.value = withTiming(pos.y, animationConfig);
      }
    },
  );

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {x: number; y: number}
  >({
    onStart: (_, ctx) => {
      // dont allow drag start if we're done editing
      if (editing) {
        ctx.x = translateX.value;
        ctx.y = translateY.value;
      }
    },
    onActive: ({translationX, translationY}, ctx) => {
      // dont allow drag if we're done editing
      if (editing) {
        translateX.value = ctx.x + translationX;
        translateY.value = ctx.y + translationY;
        // 1. We calculate where the tile should be
        const newOrder = getOrder(
          translateX.value,
          translateY.value,
          Object.keys(positions.value).length - 1,
        );

        // 2. We swap the positions
        const oldOlder = positions.value[item?.id];
        if (newOrder !== oldOlder) {
          const idToSwap = Object.keys(positions.value).find(
            key => positions.value[key] === newOrder,
          );
          if (idToSwap) {
            // Spread operator is not supported in worklets
            // And Object.assign doesn't seem to be working on alpha.6
            const newPositions = JSON.parse(JSON.stringify(positions.value));
            newPositions[item?.id] = newOrder;
            newPositions[idToSwap] = oldOlder;
            positions.value = newPositions;
          }
        }

        // 3. Scroll up and down if necessary
        const lowerBound = scrollY.value;
        const upperBound = lowerBound + containerHeight - SIZE;
        const maxScroll = contentHeight - containerHeight;
        const leftToScrollDown = maxScroll - scrollY.value;
        if (translateY.value < lowerBound) {
          const diff = Math.min(lowerBound - translateY.value, lowerBound);
          scrollY.value -= diff;
          scrollTo(scrollView, 0, scrollY.value, false);
          ctx.y -= diff;
          translateY.value = ctx.y + translationY;
        }
        if (translateY.value > upperBound) {
          const diff = Math.min(
            translateY.value - upperBound,
            leftToScrollDown,
          );
          scrollY.value += diff;
          scrollTo(scrollView, 0, scrollY.value, false);
          ctx.y += diff;
          translateY.value = ctx.y + translationY;
        }
      }
    },
    onEnd: () => {
      const newPosition = getPosition(positions.value[item?.id]!, itemSeparateHeight);
      translateX.value = withTiming(newPosition.x, animationConfig, () => {
        if (onDragEnd) {
          const oldIndex = oldData.findIndex((item: any) => item.id == item?.id);
          const newIndex = positions?.value[item?.id] - 1;
          if (oldIndex !== -1 && newIndex >= 0 && newIndex < oldData.length) {
            const newData = [...oldData]; // Create a copy of the old array
            const [removedItem] = newData.splice(oldIndex, 1); // Remove the item from the old position
            newData.splice(newIndex, 0, removedItem); // Insert the item at the new position
            // Now newData contains the array with the item moved to the new position
            runOnJS(onDragEnd)(newData);
          } else {
            console.log('Invalid indices or item not found.');
          }
        }
      });
      translateY.value = withTiming(newPosition.y, animationConfig);
    },
  });

  const style = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    const scale = withSpring(isGestureActive.value ? 1.05 : 1);
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: SIZE,
      zIndex,
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale},
      ],
      backgroundColor: 'pink',
    };
  });

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      delayLongPress={200}
      onPressOut={onPressOut}>
      <Animated.View style={style}>
        <PanGestureHandler enabled={editing} onGestureEvent={onGestureEvent}>
          <Animated.View style={StyleSheet.absoluteFill}>
            {renderItem({item, index})}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Item;

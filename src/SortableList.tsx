import React, {ReactNode} from 'react';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Item from './Item';
import {COL, Positions, SIZE} from './Config';
import {Text} from 'react-native';

interface ListProps {
  editing?: boolean;
  onDragEnd?: (newArray: Array<object>) => void; // Modify onDragEnd function to accept old and new indices
  itemSeparateHeight?: number;
  data: Array<{id: number; uri: string}>;
  renderItem: ({item, index}: {item: any; index: number}) => React.ReactNode;
}

const List = ({
  editing,
  onDragEnd,
  itemSeparateHeight,
  data,
  renderItem,
}: ListProps) => {
  const scrollY = useSharedValue(0);
  const scrollView = useAnimatedRef<any>();
  const positions = useSharedValue<Positions>(
    Object.assign(
      {},
      ...data.map((item, index) => ({[`${item.id}`]: item.id})),
    ),
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: ({contentOffset: {y}}) => {
      scrollY.value = y;
    },
  });

  const handleDragEnd = (newArray: Array<object>) => {
    if (onDragEnd) {
      onDragEnd(newArray);
    }
  };

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      ref={scrollView}
      contentContainerStyle={{
        height: Math.ceil(data.length / COL) * (SIZE + 30),
      }}
      showsVerticalScrollIndicator={false}
      bounces={false}
      scrollEventThrottle={16}>
      {data.map((ele, i) => {
        return (
          <Item
            key={i.toString()}
            positions={positions}
            oldData={data}
            editing={editing}
            onDragEnd={handleDragEnd} // Pass handleDragEnd function
            scrollView={scrollView}
            scrollY={scrollY}
            index={i}
            item={ele}
            itemSeparateHeight={itemSeparateHeight}
            renderItem={({item, index}) => renderItem({item, index})}
          />
        );
      })}
    </Animated.ScrollView>
  );
};

export default List;

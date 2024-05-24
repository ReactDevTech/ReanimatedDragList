import React from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { Positions } from './Config';
import Item from './Item';
import { TouchableOpacity } from 'react-native-gesture-handler';
const {height} = Dimensions.get('window')
interface DragListProps {
  editing?: boolean;
  onDragEnd?: (newArray: Array<object>) => void; // Modify onDragEnd function to accept old and new indices
  itemSeparateHeight?: number;
  data: Array<{id: number; }>;
  renderItem: ({item, index}: {item: any; index: number}) => React.ReactNode;
  itemHeight:number
  itemWidth:number
  onLongPress?:()=>void; //
  onPressOut?:()=>void; //
}

const DragList = ({
  editing,
  onDragEnd,
  itemSeparateHeight=0,
  data,
  renderItem,
  itemHeight,
  itemWidth,
  onLongPress,
  onPressOut
}: DragListProps) => {
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
const totalContentHeight = data.length * (itemHeight + itemSeparateHeight);
  return (
    <Animated.ScrollView
      onScroll={onScroll}
      ref={scrollView}
      contentContainerStyle={{
        height:totalContentHeight,

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
            itemHeight={itemHeight}
            itemWidth={itemWidth}
            onLongPress={onLongPress} 
            onPressOut={onPressOut}
            
          />
        );
      })}
    </Animated.ScrollView>
  );
};

export default DragList;

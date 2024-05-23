import React from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {MARGIN} from './Config';
import {Dimensions, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DragList from './DragList';
const {width} =Dimensions.get('window')
const tiles = [
  {id: 1},
  {id: 2},
  {id: 3},
  {id: 4},
  {id: 5},
  {id: 6},
  {id: 7},
  {id: 8},
];

const App = () => {
  const combinedTiles = [
    ...tiles,
    ...tiles.map(tile => ({...tile, id: tile.id + 8})),
  ];

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <SafeAreaView
        style={{flex: 1, backgroundColor: 'white', paddingHorizontal: MARGIN}}>
        <GestureHandlerRootView style={{flex: 1}}>
          <DragList
            editing={true}
            itemSeparateHeight={10}
            data={combinedTiles}
            itemHeight={100}
            itemWidth={width}
            renderItem={({item, index}) => {
              return (
                <View >
                  <Text>{index}</Text>
                </View>
              );
            }}
            // onDragEnd={newArray => console.log('newArray::::', newArray)}
          />
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;

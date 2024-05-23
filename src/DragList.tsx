import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MARGIN} from './Config';
import Tile from './Tile';
import SortableList from './SortableList';
import {Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const tiles = [
  {id: 1, uri: 'https://google.com'},
  {id: 2, uri: 'https://expo.io'},
  {id: 3, uri: 'https://facebook.com'},
  {id: 4, uri: 'https://docs.swmansion.com/react-native-reanimated/'},
  {id: 5, uri: 'https://github.com'},
  {id: 6, uri: 'https://reactnavigation.org/'},
  {id: 7, uri: 'https://youtube.com'},
  {id: 8, uri: 'https://twitter.com'},
];

const DragList = () => {
  const combinedTiles = [
    ...tiles,
    ...tiles.map(tile => ({...tile, id: tile.id + 8})),
  ];

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: 'white', paddingHorizontal: MARGIN}}>
      <GestureHandlerRootView style={{flex: 1}}>
        <SortableList
          editing={true}
          itemSeparateHeight={10}
          data={combinedTiles}
          renderItem={({item, index}) => {
            return <Text>{index}</Text>;
          }}
          onDragEnd={newArray => console.log('newArray::::', newArray)}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default DragList;

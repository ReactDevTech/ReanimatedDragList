import React, {useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {MARGIN} from './Config';
import DragList from './DragList';
const {width} = Dimensions.get('window');
const tiles = [
  {id: 1},
  {id: 2},
  {id: 3},
  {id: 4},
  {id: 5},
  {id: 6},
  {id: 7},
  {id: 8},
  {id: 9},
  {id: 10},
  {id: 11},
  {id: 12},
  {id: 13},
  {id: 14},
  {id: 15},
];

const App = () => {
  const combinedTiles = [...tiles];
  const [editList, setEditList] = useState(false);

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <SafeAreaView
        style={{flex: 1,paddingHorizontal: 20}}>
          <Text
            style={{
              textAlign: 'right',
              marginHorizontal: 10,
              fontWeight: '600',
              color: 'black',
              textTransform: 'capitalize',
            }}
            onPress={() => setEditList(!editList)}>
            {editList ? 'done' : 'edit'}
          </Text>
          <DragList
            editing={editList}
            itemSeparateHeight={10}
            data={combinedTiles}
            itemHeight={70}
            itemWidth={width}
            renderItem={({item, index}) => {
              return (
                <View>
                  <Text>{item.id}</Text>
                </View>
              );
            }}
          />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;

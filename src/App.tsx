import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import DragList from './DragList';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <SafeAreaProvider style={{flex: 1}}>
        <DragList />
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({});

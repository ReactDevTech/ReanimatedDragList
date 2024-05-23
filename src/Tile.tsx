import React from "react";
import { StyleSheet, Text, View } from "react-native";


import { MARGIN, SIZE } from "./Config";

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: 70,
  },
});
interface TileProps {
  id: string;
  uri: string;
  onLongPress: () => void;
}

const Tile = ({ id }: TileProps) => {
  return (
    <View style={styles.container}>
      <Text>{id}</Text>
    
    </View>
  );
};

export default Tile;
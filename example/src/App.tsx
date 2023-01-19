import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { setup } from 'react-native-offstore';

setup();

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Result: {33}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

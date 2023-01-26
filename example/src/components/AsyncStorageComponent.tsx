import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import twitter from './twitter.json';

export const STORAGE_KEY = 'item';
export const STORAGE_PAYLOAD = JSON.stringify(twitter);

export const setupParallelBenchmark = async () => {
  AsyncStorage.setItem(STORAGE_KEY, STORAGE_PAYLOAD);
};

export const performParallelBenchmark = async () => {
  const data = Array.from(Array(100).keys());
  const promises = data.map(() => AsyncStorage.getItem(STORAGE_KEY));

  const start = performance.now();
  await Promise.all(promises);
  const end = performance.now();
  return end - start;
};

performParallelBenchmark();

export default function App() {
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    setupParallelBenchmark().then(performParallelBenchmark).then(setTime);
  }, []);

  return (
    <View style={styles.container}>
      <Text>AsyncStorage: {time.toFixed(2)} ms</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});

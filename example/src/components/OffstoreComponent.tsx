import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import * as Offstore from 'react-native-offstore';
import twitter from './twitter.json';

export const STORAGE_KEY = 'item';
export const STORAGE_PAYLOAD = JSON.stringify(twitter);

export const setupParallelBenchmark = () => {
  Offstore.setup();
  Offstore.setState(STORAGE_PAYLOAD);
};

export const performParallelBenchmark = () => {
  const data = Array.from(Array(100).keys());

  const start = performance.now();
  data.forEach(() => Offstore.getState());
  const end = performance.now();
  return end - start;
};

export default function App() {
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    setupParallelBenchmark();
    setTime(performParallelBenchmark());
  }, []);

  return (
    <View style={styles.container}>
      <Text>Offstore: {time.toFixed(2)} ms</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});

import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import * as Offstore from 'react-native-offstore';
import twitter from './twitter.json';
import twittel from './twittel.json';

export const STORAGE_EXPENSIVE_KEY = 'expensive';
export const STORAGE_EXPENSIVE_PAYLOAD = JSON.stringify(twitter);
export const STORAGE_CHEAP_KEY = 'cheap';
export const STORAGE_CHEAP_PAYLOAD = JSON.stringify(twittel);

export const setupExpensiveParallelBenchmark = () => {
  Offstore.setState(STORAGE_EXPENSIVE_PAYLOAD);
};

export const setupCheapParallelBenchmark = () => {
  Offstore.setState(STORAGE_CHEAP_PAYLOAD);
};

export const performExpensiveParallelBenchmark = () => {
  const data = Array.from(Array(100).keys());

  const start = performance.now();
  data.map(() => Offstore.getState());
  const end = performance.now();
  return end - start;
};

export const performCheapParallelBenchmark = () => {
  const data = Array.from(Array(100).keys());

  const start = performance.now();
  data.map(() => Offstore.getState());
  const end = performance.now();
  return end - start;
};

export default function App() {
  const [timeExpensive, setTimeExpensive] = React.useState(0);
  const [timeCheap, setTimeCheap] = React.useState(0);

  React.useEffect(() => {
    setupExpensiveParallelBenchmark();
    setTimeExpensive(performExpensiveParallelBenchmark());

    setupCheapParallelBenchmark();
    setTimeCheap(performCheapParallelBenchmark());
  }, []);

  return (
    <View style={styles.container}>
      <Text>AsyncStorage (~15K/Loc): {timeExpensive.toFixed(2)} ms</Text>
      <Text>AsyncStorage (400/Loc): {timeCheap.toFixed(2)} ms</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});

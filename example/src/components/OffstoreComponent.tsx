import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
  const data = Array.from(Array(500).keys());

  const start = performance.now();
  data.map(() => Offstore.getState());
  const end = performance.now();
  return end - start;
};

export const performCheapParallelBenchmark = () => {
  const data = Array.from(Array(500).keys());

  const start = performance.now();
  data.map(() => Offstore.getState());
  const end = performance.now();
  return end - start;
};

export default function App() {
  const [timeExpensive, setTimeExpensive] = React.useState(0);
  const [timeCheap, setTimeCheap] = React.useState(0);

  const runBenchmarks = React.useCallback(() => {
    setupExpensiveParallelBenchmark();
    setTimeExpensive(performExpensiveParallelBenchmark());

    setupCheapParallelBenchmark();
    setTimeCheap(performCheapParallelBenchmark());
  }, []);

  React.useEffect(() => {
    runBenchmarks();
  }, [runBenchmarks]);

  const pollStorage = React.useCallback(() => {
    setInterval(() => {
      Offstore.getState();
    }, 20);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.item}>
        Offstore (~15K/Loc): {timeExpensive.toFixed(2)} ms
      </Text>
      <Text style={styles.item}>
        Offstore (400/Loc): {timeCheap.toFixed(2)} ms
      </Text>
      <TouchableOpacity
        onPress={runBenchmarks}
        style={[styles.buttonDefault, styles.item]}
      >
        <Text>Refresh</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={pollStorage}
        style={[styles.buttonDanger, styles.item]}
      >
        <Text>Expensive polling</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  item: {
    marginBottom: 10,
  },
  buttonDefault: {
    backgroundColor: 'red',
    padding: 10,
  },
  buttonDanger: {
    backgroundColor: 'red',
    padding: 10,
  },
});

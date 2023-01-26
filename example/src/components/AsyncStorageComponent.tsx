import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import twitter from './twitter.json';
import twittel from './twittel.json';

export const STORAGE_EXPENSIVE_KEY = 'expensive';
export const STORAGE_EXPENSIVE_PAYLOAD = JSON.stringify(twitter);
export const STORAGE_CHEAP_KEY = 'cheap';
export const STORAGE_CHEAP_PAYLOAD = JSON.stringify(twittel);

export const setupExpensiveParallelBenchmark = async () => {
  AsyncStorage.setItem(STORAGE_EXPENSIVE_KEY, STORAGE_EXPENSIVE_PAYLOAD);
};

export const setupCheapParallelBenchmark = async () => {
  AsyncStorage.setItem(STORAGE_CHEAP_KEY, STORAGE_CHEAP_PAYLOAD);
};

export const performExpensiveParallelBenchmark = async () => {
  const data = Array.from(Array(100).keys());
  const promises = data.map(() => AsyncStorage.getItem(STORAGE_EXPENSIVE_KEY));

  const start = performance.now();
  await Promise.all(promises);
  const end = performance.now();
  return end - start;
};

export const performCheapParallelBenchmark = async () => {
  const data = Array.from(Array(100).keys());
  const promises = data.map(() => AsyncStorage.getItem(STORAGE_CHEAP_KEY));

  const start = performance.now();
  await Promise.all(promises);
  const end = performance.now();
  return end - start;
};

export default function App() {
  const [timeExpensive, setTimeExpensive] = React.useState(0);
  const [timeCheap, setTimeCheap] = React.useState(0);

  const runBenchmarks = React.useCallback(() => {
    Promise.resolve()
      .then(() =>
        setupExpensiveParallelBenchmark()
          .then(performExpensiveParallelBenchmark)
          .then(setTimeExpensive)
      )
      .then(() =>
        setupCheapParallelBenchmark()
          .then(performCheapParallelBenchmark)
          .then(setTimeCheap)
      );
  }, []);

  const pollStorage = React.useCallback(() => {
    setInterval(() => {
      AsyncStorage.getItem(STORAGE_CHEAP_KEY);
    }, 20);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.item}>
        AsyncStorage (~15K/Loc): {timeExpensive.toFixed(2)} ms
      </Text>
      <Text style={styles.item}>
        AsyncStorage (400/Loc): {timeCheap.toFixed(2)} ms
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
    backgroundColor: 'gray',
    padding: 10,
  },
  buttonDanger: {
    backgroundColor: 'red',
    padding: 10,
  },
});

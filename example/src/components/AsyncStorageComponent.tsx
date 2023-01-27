import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import twitter from './twitter.json';
import twittel from './twittel.json';
import * as utils from './utils';

export const STORAGE_EXPENSIVE_KEY = 'expensive';
export const STORAGE_EXPENSIVE_PAYLOAD = JSON.stringify(twitter);
export const STORAGE_CHEAP_KEY = 'cheap';
export const STORAGE_CHEAP_PAYLOAD = JSON.stringify(twittel);

export const setupExpensiveSequentialBenchmark = async () => {
  AsyncStorage.setItem(STORAGE_EXPENSIVE_KEY, STORAGE_EXPENSIVE_PAYLOAD);
};

export const setupCheapSequentialBenchmark = async () => {
  AsyncStorage.setItem(STORAGE_CHEAP_KEY, STORAGE_CHEAP_PAYLOAD);
};

export const performExpensiveSequentialBenchmark = async () => {
  const start = performance.now();
  await utils.sequentialIterationAsync(100, () =>
    AsyncStorage.getItem(STORAGE_EXPENSIVE_KEY)
  );
  const end = performance.now();
  return end - start;
};

export const performCheapSequentialBenchmark = async () => {
  const start = performance.now();
  await utils.sequentialIterationAsync(100, () =>
    AsyncStorage.getItem(STORAGE_CHEAP_KEY)
  );
  const end = performance.now();
  return end - start;
};

export const performSequentialWriteBenchmark = async () => {
  const start = performance.now();
  await utils.sequentialIterationAsync(100, () =>
    AsyncStorage.setItem(
      STORAGE_EXPENSIVE_KEY,
      JSON.stringify({
        ...twitter,
        search_metadata: { ...twitter.search_metadata, completed_in: 777 },
      })
    )
  );
  const end = performance.now();
  return end - start;
};

export default function App() {
  const [timeExpensive, setTimeExpensive] = React.useState(0);
  const [timeCheap, setTimeCheap] = React.useState(0);
  const [timeWrite, setTimeWrite] = React.useState(0);

  const runBenchmarks = React.useCallback(() => {
    Promise.resolve()
      .then(() =>
        setupExpensiveSequentialBenchmark()
          .then(performExpensiveSequentialBenchmark)
          .then(setTimeExpensive)
      )
      .then(() =>
        setupCheapSequentialBenchmark()
          .then(performCheapSequentialBenchmark)
          .then(setTimeCheap)
      )
      .then(() =>
        setupCheapSequentialBenchmark()
          .then(performSequentialWriteBenchmark)
          .then(setTimeWrite)
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
        [READ] AsyncStorage (~15K/Loc): {timeExpensive.toFixed(2)} ms
      </Text>
      <Text style={styles.item}>
        [READ] AsyncStorage (400/Loc): {timeCheap.toFixed(2)} ms
      </Text>
      <Text style={styles.item}>
        [WRITE] AsyncStorage (Write) (~15K/Loc): {timeWrite.toFixed(2)} ms
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

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
  await utils.sequentialIterationAsync(100, async () => {
    const response = await AsyncStorage.getItem(STORAGE_EXPENSIVE_KEY);
    // '/statuses/1/metadata/iso_language_code'
    return JSON.parse(response || '').statuses[1].metadata.iso_language_code;
  });
  const end = performance.now();
  return end - start;
};

export const performCheapSequentialBenchmark = async () => {
  const start = performance.now();
  await utils.sequentialIterationAsync(100, async () => {
    const response = await AsyncStorage.getItem(STORAGE_CHEAP_KEY);
    // '/statuses/1/metadata/iso_language_code'
    return JSON.parse(response || '').statuses[1].metadata.iso_language_code;
  });
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

  return (
    <View style={styles.container}>
      <Text style={styles.item}>
        <Text style={styles.strong}>[100xREAD|650kb]</Text> AsyncStorage:&nbsp;
        {timeExpensive.toFixed(2)} ms
      </Text>
      <Text style={styles.item}>
        <Text style={styles.strong}>[100xREAD|15kb]</Text> AsyncStorage:&nbsp;
        {timeCheap.toFixed(2)} ms
      </Text>
      <Text style={styles.item}>
        <Text style={styles.strong}>[100xWRITE|650kb]</Text> AsyncStorage:&nbsp;
        {timeWrite.toFixed(2)} ms
      </Text>
      <TouchableOpacity
        onPress={runBenchmarks}
        style={[styles.buttonDefault, styles.item]}
      >
        <Text style={styles.alternative}>Test asyncstorage</Text>
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
    backgroundColor: 'green',
    padding: 10,
  },
  alternative: {
    color: '#fafafa',
  },
  strong: {
    fontWeight: '600',
  },
});

import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Offstore from 'react-native-offstore';
import twitter from './twitter.json';
import twittel from './twittel.json';
import * as utils from './utils';

export const STORAGE_EXPENSIVE_KEY = 'expensive';
export const STORAGE_EXPENSIVE_PAYLOAD = twitter;
export const STORAGE_CHEAP_KEY = 'cheap';
export const STORAGE_CHEAP_PAYLOAD = twittel;

export const setupExpensiveSequentialBenchmark = () => {
  Offstore.setState(STORAGE_EXPENSIVE_PAYLOAD);
};

export const setupCheapSequentialBenchmark = () => {
  Offstore.setState(STORAGE_CHEAP_PAYLOAD);
};

export const performExpensiveSequentialBenchmark = () => {
  const start = performance.now();
  utils.sequentialIterationSync(100, () =>
    Offstore.pointer('/statuses/1/metadata/iso_language_code')
  );
  const end = performance.now();
  return end - start;
};

export const performCheapSequentialBenchmark = () => {
  const start = performance.now();
  utils.sequentialIterationSync(100, () =>
    Offstore.pointer('/statuses/1/metadata/iso_language_code')
  );
  const end = performance.now();
  return end - start;
};

export const performSequentialWriteBenchmark = () => {
  const start = performance.now();
  utils.sequentialIterationSync(100, () =>
    Offstore.patchState({ search_metadata: { completed_in: 777 } })
  );
  const end = performance.now();
  return end - start;
};

export default function App() {
  const [timeExpensive, setTimeExpensive] = React.useState(0);
  const [timeCheap, setTimeCheap] = React.useState(0);
  const [timeWrite, setTimeWrite] = React.useState(0);

  const runBenchmarks = React.useCallback(() => {
    setupExpensiveSequentialBenchmark();
    setTimeExpensive(performExpensiveSequentialBenchmark());

    setupCheapSequentialBenchmark();
    setTimeCheap(performCheapSequentialBenchmark());

    setupExpensiveSequentialBenchmark();
    setTimeWrite(performSequentialWriteBenchmark());
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.item}>
        <Text style={styles.strong}>[100xREAD|650kb]</Text> Offstore:&nbsp;
        {timeExpensive.toFixed(2)} ms
      </Text>
      <Text style={styles.item}>
        <Text style={styles.strong}>[100xREAD|15kb]</Text> Offstore:&nbsp;
        {timeCheap.toFixed(2)} ms
      </Text>
      <Text style={styles.item}>
        <Text style={styles.strong}>[100xWRITE|650kb]</Text> Offstore:&nbsp;
        {timeWrite.toFixed(2)} ms
      </Text>
      <TouchableOpacity
        onPress={runBenchmarks}
        style={[styles.buttonDefault, styles.item]}
      >
        <Text style={styles.alternative}>Test offstore</Text>
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

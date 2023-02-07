import * as React from 'react';

import { StyleSheet, SafeAreaView, Text } from 'react-native';
import * as Offstore from 'react-native-offstore';
import AsyncStorageComponent from './components/AsyncStorageComponent';
import OffstoreComponent from './components/OffstoreComponent';

Offstore.setup();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>
        note: The objective of this benchmark is to measure time it takes to
        retrieve a small subset of a large json object.
      </Text>
      <AsyncStorageComponent />
      <OffstoreComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
});

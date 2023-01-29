import * as React from 'react';

import { StyleSheet, SafeAreaView } from 'react-native';
import * as Offstore from 'react-native-offstore';
import AsyncStorageComponent from './components/AsyncStorageComponent';
import OffstoreComponent from './components/OffstoreComponent';
import OffstoreSubscriberComponent from './components/OffstoreSubscriberComponent';

Offstore.setup();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AsyncStorageComponent />
      <OffstoreComponent />
      <OffstoreSubscriberComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
});

import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Offstore from 'react-native-offstore';

export default function App() {
  const [response, setResponse] = React.useState({});

  React.useEffect(() => {
    Offstore.subscribe('/cars/dodge', (payload, diff) =>
      setResponse({ payload, diff })
    );
  });

  const runUpdate = React.useCallback(() => {
    Offstore.setState({});
    Offstore.setState({ cars: { ford: 1 } });
    Offstore.setState({ cars: { dodge: 1 } });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.item}>{JSON.stringify(response, null, 2)}</Text>

      <TouchableOpacity
        onPress={runUpdate}
        style={[styles.buttonDefault, styles.item]}
      >
        <Text>Subscribe</Text>
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

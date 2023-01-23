# react-native-offstore

**JSI powered, persistent state management for React Native.**

Offstore is a simple, yet powerful, state management solution for React Native. It is built on top of the JSI + Turbo Modules, which allows for fast, bridgeless and synchronous state access and persistence.

## Requirements

React Native 0.71 or higher. Android and iOS are supported.

## Installation

```sh
yarn add react-native-offstore
```

## Usage

```js
import * as Offstore from 'react-native-offstore';

/**
 * Sets up the Offstore package environment
 */
Offstore.setup();

/**
 * Read state synchronously
 */
const state = Offstore.getState();

/**
 * Write state synchronously
 */
Offstore.setState({ app: { version: 1.5, beta: false }, data: ['optical', 'matrix', 'konflict'] });

/**
 * JSON merge patch https://tools.ietf.org/html/rfc7386
 */
Offstore.patchState({ app: { beta: true } });

/**
 * Subscribe to state changes
 */
const unsubscribe = Offstore.subscribe(console.log);

/**
 * Unsubscribe from state changes
 */
unsubscribe();
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

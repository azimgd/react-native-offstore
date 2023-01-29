# react-native-offstore

**JSI powered, persistent state management for React Native.**

Offstore is a simple, yet powerful, state management solution for React Native. It is built on top of the JSI + Turbo Modules, which allows for fast, bridgeless and synchronous state access and persistence.

## Requirements

React Native 0.71 or higher. Android and iOS are supported. Works only with new architecture projects.

## Installation

```sh
yarn add react-native-offstore
```

### iOS

1. Make sure new architecture is enabled. In your `Podfile` add:

```ruby
ENV['RCT_NEW_ARCH_ENABLED'] = '1'
```

2. Run `pod install`

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
 * JSON pointer https://tools.ietf.org/html/rfc6901
 */
Offstore.pointer('/app/version');

/**
 * Subscribe to state changes
 * Emits when {user: {details: {}}} has changed
 */
const unsubscribe = Offstore.subscribe('/user/details', console.log);

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

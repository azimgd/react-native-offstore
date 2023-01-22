const Offstore = require('./NativeOffstore').default;

declare global {
  function subscribe(callback: (payload: string) => void): void;
  var __OffstoreProxy: object | null;
  var __OffstoreHostObject: {
    subscribe: (property: string, payload: any) => void;
    unsubscribe: (property: string) => void;
    state: any;
  };
}

/**
 * Setup the Offstore JSI extension.
 */
export function setup(): boolean {
  return Offstore.setup();
}

/**
 * Get Offstore state object.
 */
export function getState(): any {
  const payload = JSON.parse(global.__OffstoreHostObject.state);
  return payload;
}

/**
 * Set Offstore state object.
 */
export function setState(payload: any): any {
  global.__OffstoreHostObject.state = JSON.stringify(payload);
}

/**
 * Subscribe to Offstore state changes. Returns a function to unsubscribe.
 * This function is only called on state changes.
 */
export function subscribe(callback: (payload: any) => any) {
  const pseudoUniqueCallbackId = (Math.random() + Date.now()).toString();
  global.__OffstoreHostObject.subscribe(pseudoUniqueCallbackId, callback);
  return () => global.__OffstoreHostObject.unsubscribe(pseudoUniqueCallbackId);
}

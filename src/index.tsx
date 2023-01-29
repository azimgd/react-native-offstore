const Offstore = require('./NativeOffstore').default;

declare global {
  function subscribe(
    path: string,
    callback: (payload: string, diff: string) => void
  ): void;
  var __OffstoreProxy: object | null;
  var __OffstoreHostObject: {
    patch: (payload: any) => void;
    subscribe: (path: string, payload: any) => void;
    unsubscribe: (path: string) => void;
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
 * Patch merge Offstore state object.
 */
export function patchState(payload: any): any {
  global.__OffstoreHostObject.patch(JSON.stringify(payload));
}

/**
 * Subscribe to Offstore state changes. Returns a function to unsubscribe.
 * This function is only called on state changes.
 */
export function subscribe(
  path: string,
  callback: (payload: any, diff: any) => any
) {
  global.__OffstoreHostObject.subscribe(path, callback);
  return () => global.__OffstoreHostObject.unsubscribe(path);
}

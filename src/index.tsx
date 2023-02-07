const Offstore = require('./NativeOffstore').default;

declare global {
  var __OffstoreProxy: object | null;
  var __OffstoreHostObject: {
    patch: (payload: any) => void;
    pointer: (path: string) => any;
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
 * Get Offstore state object.
 */
export function pointer(path: string): any {
  const payload = JSON.parse(global.__OffstoreHostObject.pointer(path));
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

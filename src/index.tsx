const Offstore = require('./NativeOffstore').default;

declare global {
  function watch(callback: (payload: string) => void): void;
  var __OffstoreProxy: object | null;
  var __OffstoreHostObject: {
    watch: (property: string, payload: any) => void;
    state: any;
  };
}

export function setup(): boolean {
  return Offstore.setup();
}

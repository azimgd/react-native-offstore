const Offstore = require('./NativeOffstore').default;

export function multiply(a: number, b: number): number {
  return Offstore.multiply(a, b);
}

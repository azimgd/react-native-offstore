export const sequentialIterationSync = (
  amount: number,
  callback: () => any
) => {
  const data = Array.from(Array(amount).keys());
  const tasks = data.map(() => callback);

  const start = performance.now();
  for (const task of tasks) {
    task();
  }
  const end = performance.now();
  return end - start;
};

export const sequentialIterationAsync = async (
  amount: number,
  callback: () => any
) => {
  const data = Array.from(Array(amount).keys());
  const tasks = data.map(() => callback);

  const start = performance.now();
  for (const task of tasks) {
    await task();
  }
  const end = performance.now();
  return end - start;
};

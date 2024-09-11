export function omitProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K
): Omit<T, K> {
  const o: Omit<T, K> & Partial<Pick<T, K>> = { ...obj };
  delete o[key];
  return o;
}

export function proxiedPropertiesOf<TObj>() {
    return new Proxy({}, {
        get: (_, prop) => prop,
        set: () => {
            throw Error('Set not supported');
        },
    }) as {
        [P in keyof TObj]: P;
    };
}

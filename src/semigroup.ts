export interface Semigroup<T> {
  merge: (a: T) => T;
}

export function merge<A extends Semigroup<A>>(a: A, b: A): A {
  return a.merge(b);
}

export interface Semigroup<T> {
  merge: (a: T) => T;
}

export function merge(a: string, b: string): string;
export function merge<A extends Semigroup<A>>(a: A, b: A): A;
export function merge<A extends Semigroup<A>>(a: any, b: any): A | string {
  if (typeof a === "string") {
    return a + b;
  } else {
    return a.merge(b);
  }
}

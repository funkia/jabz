export interface Semigroup<T> {
  combine: (a: T) => T;
}

export function combine(a: string, b: string): string;
export function combine<A extends Semigroup<A>>(a: A, b: A): A;
export function combine<A extends Semigroup<A>>(a: any, b: any): A | string {
  if (typeof a === "string") {
    return a + b;
  } else {
    return a.combine(b);
  }
}

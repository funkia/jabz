export interface Semigroup<T> {
  combine: (a: T) => T;
}

export type AnySemigroup<A> = string | Array<any> | Semigroup<A>;

export function combine<A>(a: A[], b: A[]): A[];
export function combine(a: string, b: string): string;
export function combine<A extends Semigroup<A>>(a: A, b: A): A;
export function combine<A extends AnySemigroup<A>>(a: A, b: A): A;
export function combine<A extends Semigroup<A>>(a: any, b: any): A | string | A[] {
  if (Array.isArray(a)) {
    return a.concat(b);
  } else if (typeof a === "string") {
    return a + b;
  } else {
    return a.combine(b);
  }
}

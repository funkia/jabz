export interface Semigroup<T> {
  combine: (a: T) => T;
}

export type AnySemigroup<A> = string | Array<any> | Semigroup<A>;

export function combine<A extends AnySemigroup<A>>(a: A, b: A): A;
export function combine<A extends AnySemigroup<A>>(a: any, b: any): AnySemigroup<A> {
  if (Array.isArray(a)) {
    return a.concat(b);
  } else if (typeof a === "string") {
    return a + b;
  } else {
    return a.combine(b);
  }
}

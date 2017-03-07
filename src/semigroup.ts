import {foldlArray, arrayFlatten} from "./utils";

export interface Semigroup<T> {
  combine: (a: T) => T;
}

export type AnySemigroup<A> = string | Array<any> | Semigroup<A>;

function combineTwo<A extends Semigroup<A>>(a: A, b: A): A {
  return a.combine(b);
}

export function combine<A extends AnySemigroup<A>>(...a: A[]): A;
export function combine<A extends AnySemigroup<A>>(...a: any[]): AnySemigroup<A> {
  if (Array.isArray(a[0])) {
    return arrayFlatten(a);
  } else if (typeof a[0] === "string") {
    return a.join("");
  } else {
    return foldlArray<A, A>(combineTwo, a[0].identity(), a);
  }
}

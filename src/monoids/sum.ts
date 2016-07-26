import {Monoid} from "../monoid";

export type Sum = ImplSum;

class ImplSum implements Monoid<number> {
  constructor(private n: number) {};
  identity = sumId;
  merge(s: Sum): Sum {
    return new ImplSum(this.n + s.n);
  }
}

export function Sum(n: number) {
  return new ImplSum(n);
}

export const sumId = new ImplSum(0);

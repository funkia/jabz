import {Monoid, MonoidConstructor} from "../monoid";

export type Sum = ImplSum;

class ImplSum implements Monoid<Sum> {
  constructor(public n: number) {};
  identity = sumId;
  merge(s: Sum): Sum {
    return new ImplSum(this.n + s.n);
  }
}

export const sumId = new ImplSum(0);
sumId.identity = sumId;

interface SumConstructor {
  (a: number): any;
  identity: Sum;
}
var temp = <SumConstructor>function(n: number) {
  return new ImplSum(n);
};
temp.identity = sumId;

export function toNumber(s: Sum): number {
  return s.n;
}

export const Sum: MonoidConstructor<number, Sum> = temp;

import {Monoid, MonoidConstructor} from "../monoid";

export type Sum = ImplSum;

class ImplSum implements Monoid<Sum> {
  constructor(private n: number) {};
  identity = sumId;
  merge(s: Sum): Sum {
    return new ImplSum(this.n + s.n);
  }
}

export const sumId = new ImplSum(0);

interface F { (n: number): any; identity: Monoid<Sum>; }

var f = <F>function (n: number) { return new ImplSum(n); }
f.identity = sumId;

interface SumConstructor {
  (a: number): any;
  identity: Sum;
}
var temp = <SumConstructor>function(n: number) {
  return new ImplSum(n);
};
temp.identity = sumId;

export const Sum: MonoidConstructor<number, Sum> = temp;

import {Monoid, MonoidConstructor} from "../monoid";

export type Sum = ImplSum;

class ImplSum implements Monoid<Sum> {
  constructor(public n: number) {};
  identity(): Sum { return sumId; }
  merge(s: Sum): Sum {
    return new ImplSum(this.n + s.n);
  }
}

export const sumId = new ImplSum(0);

export function toNumber(s: Sum): number {
  return s.n;
}

export const Sum: MonoidConstructor<number, Sum> = (() => {
  let t: any = function(n: number): Sum {
    return new ImplSum(n);
  };
  t.identity = () => sumId;
  return t;
})();

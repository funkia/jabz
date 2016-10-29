import {Monoid, MonoidConstructor} from "../monoid";

export default class Sum implements Monoid<Sum> {
  constructor(private n: number) {};
  static identity(): Sum {
    return sumId;
  }
  identity(): Sum {
    return sumId;
  }
  combine(s: Sum): Sum {
    return new Sum(this.n + s.n);
  }
  static toNumber(s: Sum): number {
    return s.n;
  }
  static create(n: number): Sum {
    return new Sum(n);
  }
}

const sumId = new Sum(0);

import {Monoid, MonoidConstructor} from "../monoid";

function endoComp<A>(f1: (a: A) => A, f2: (a: A) => A): (a: A) => A {
  return (a: A) => f1(f2(a));
}

export default class Endo<A> implements Monoid<Endo<A>> {
  constructor(public fn: (a: A) => A) {};
  static identity(): Endo<any> {
    return endoId;
  };
  identity(): Endo<A> {
    return endoId;
  };
  combine(e: Endo<A>): Endo<A> {
    return new Endo(endoComp(this.fn, e.fn));
  }
  static create<A>(f: (a: A) => A): Endo<A> {
    return new Endo(f);
  }
  static toFunction<A>(e: Endo<A>): (a: A) => A {
    return e.fn;
  }
}

const endoId: Endo<any> = new Endo(x => x);

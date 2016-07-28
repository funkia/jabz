import {Monoid, MonoidConstructor} from "../monoid";

export type Endo<A> = ImplEndo<A>;

function endoComp<A>(f1: (a: A) => A, f2: (a: A) => A): (a: A) => A {
  return (a: A) => f1(f2(a));
}

class ImplEndo<A> implements Monoid<Endo<A>> {
  constructor(public fn: (a: A) => A) {};
  identity(): Endo<A> { return endoId; };
  merge(e: Endo<A>): Endo<A> {
    return new ImplEndo(endoComp(this.fn, e.fn));
  }
}

export const endoId: Endo<any> = new ImplEndo(x => x);

export const Endo: MonoidConstructor<any, Endo<any>> = (() => {
  let t: any = function<A>(f: (a: A) => A): Endo<A> {
    return new ImplEndo(f);
  };
  t.identity = <A>(a: A): Endo<A> => endoId;
  return t;
})();

export function toFunction<A>(e: Endo<A>): (a: A) => A {
  return e.fn;
}

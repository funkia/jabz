import {Monoid, MonoidConstructor} from "../monoid";

export type Endo<A> = ImplEndo<A>;

function endoComp<A>(f1: (a: A) => A, f2: (a: A) => A): (a: A) => A {
  return (a: A) => f1(f2(a));
}

class ImplEndo<A> implements Monoid<Endo<A>> {
  constructor(public fn: (a: A) => A) {};
  identity = endoId;
  merge(e: Endo<A>): Endo<A> {
    return new ImplEndo(endoComp(this.fn, e.fn));
  }
}

export const endoId: Endo<any> = new ImplEndo(x => x);
endoId.identity = endoId;

interface EndoConstructor<A> {
  (fn: (a: A) => A): any;
  identity: Endo<A>;
}
const temp = <EndoConstructor<any>>function(fn: (a: any) => any) {
  return new ImplEndo(fn);
}
temp.identity = endoId;
export const Endo: MonoidConstructor<any, Endo<any>> = temp;

export function toFunction<A>(e: Endo<A>): (a: A) => A {
  return e.fn;
}

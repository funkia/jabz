import {Monoid, MonoidDictionary, AnyMonoid, combine, identity} from "./monoid";
import {Monad, AbstractMonad} from "./monad";

export class Writer<W extends AnyMonoid<W>, A> extends AbstractMonad<A> {
  constructor(public identity: W,
              public state: W,
              public value: A) {
    super();
  }
  of(a: A): Writer<W, A> {
    return new Writer(this.identity, this.identity, a);
  }
  chain<B>(f: (a: A) => Writer<W, B>): Writer<W, B> {
    const {state, value} = f(this.value);
    return new Writer(this.identity, combine(this.state, state), value);
  }
  multi: boolean = false;
}

export function runWriter<W extends Monoid<W>, A>(w: Writer<W, A>): [W, A] {
  return [w.state, w.value];
}

export type WriterFunctions<W extends AnyMonoid<W>> = {
  tell<A>(w: W): Writer<W, {}>,
  listen<A>(w: Writer<W, A>): Writer<W, [A, W]>,
  of<A>(a: A): Writer<W, A>
  multi: boolean;
}

export function createWriter(mc: ArrayConstructor): WriterFunctions<any[]>;
export function createWriter(mc: StringConstructor): WriterFunctions<string>;
export function createWriter<M extends Monoid<M>>(mc: MonoidDictionary<M>): WriterFunctions<M>;
export function createWriter<M extends Monoid<M>>(mc: any): any {
  const identityElm = identity(mc);
  return {
    tell(w: any): Writer<any, {}> {
      return new Writer(identityElm, w, {});
    },
    listen<A>(m: Writer<any, A>): Writer<any, [A, any]> {
      const value: [A, any] = [m.value, m.state];
      return new Writer(identityElm, m.state, value);
    },
    of<A>(a: A): Writer<any, A> {
      return new Writer(identityElm, identityElm, a);
    },
    multi: false
  };
}

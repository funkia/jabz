import {Monoid, MonoidDictionary} from "./monoid";
import {Monad, AbstractMonad} from "./monad";

export class Writer<W extends Monoid<W>, A> extends AbstractMonad<A> {
  constructor(public c: MonoidDictionary<W>, public state: W, public value: A) {
    super();
  }
  of(a: A): Writer<W, A> {
    return new Writer(this.c, this.c.identity(), a);
  }
  chain<B>(f: (a: A) => Writer<W, B>): Writer<W, B> {
    const {state, value} = f(this.value);
    return new Writer(this.c, this.state.combine(state), value);
  }
  multi: boolean = false;
}

export function runWriter<W extends Monoid<W>, A>(w: Writer<W, A>): [W, A] {
  return [w.state, w.value];
}

export function createWriter<W extends Monoid<W>>(mc: MonoidDictionary<W>): {
  tell<A>(w: W): Writer<W, {}>;
  listen<A>(w: Writer<W, A>): Writer<W, [A, W]>;
  of<A>(a: A): Writer<W, A>;
  multi: boolean
} {
  return {
    tell(w: W): Writer<W, {}> {
      return new Writer(mc, w, {});
    },
    listen<A>(m: Writer<W, A>): Writer<W, [A, W]> {
      const value: [A, W] = [m.value, m.state];
      return new Writer(mc, m.state, value);
    },
    of<A>(a: A): Writer<W, A> {
      return new Writer(mc, mc.identity(), a);
    },
    multi: false
  };
}

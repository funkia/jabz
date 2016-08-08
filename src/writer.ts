import {Monoid} from "./monoid";
import {Monad, AbstractMonad} from "./monad";

export class Writer<A> extends AbstractMonad<A> {
  constructor(public state: string, public value: A) {
    super();
  }
  of(a: A): Writer<A> {
    return new Writer("", a);
  }
  chain<B>(f: (a: A) => Writer<B>): Writer<B> {
    const {state, value} = f(this.value);
    return new Writer(this.state + state, value);
  }
}

export function runWriter<A>(w: Writer<A>): [String, A] {
  return [w.state, w.value];
}

export function tell<A>(s: string): Writer<{}> {
  return new Writer(s, {});
}

export function listen<A>(w: Writer<A>): Writer<[A, string]> {
  const value: [A, string] = [w.value, w.state];
  return new Writer(w.state, value);
}

export function of<A>(a: A): Writer<A> {
  return new Writer("", a);
}

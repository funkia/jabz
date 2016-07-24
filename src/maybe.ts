import {Functor} from "./functor";

type MaybeMatch<T, K> = {
  nothing: () => K,
  just: (t: T) => K
};

export type Maybe<T> = ImplNothing<T> | ImplJust<T>;

function of<V>(v: V): Maybe<V> {
  return new ImplJust(v);
}

class ImplNothing<A> implements Functor<A> {
  constructor() {};
  match<K>(m: MaybeMatch<any, K>): K {
    return m.nothing();
  }
  of: <B>(v: B) => Maybe<B> = of;
  chain<B>(f: (v: any) => Maybe<B>): Maybe<A> {
    return this;
  }
  map<B>(f: (a: A) => B): Maybe<B> {
    return new ImplNothing();
  }
}

class ImplJust<A> {
  val: A;
  constructor(val: A) {
    this.val = val;
  }
  match<K>(m: MaybeMatch<A, K>): K {
    return m.just(this.val);
  }
  of: <V>(v: V) => Maybe<V> = of;
  chain<B>(f: (v: A) => Maybe<B>): Maybe<B> {
    return f(this.val);
  }
  map<B>(f: (a: A) => B): Maybe<B> {
    return new ImplJust(f(this.val));;
  }
}

export function Just<V>(v: V): Maybe<V> {
  return new ImplJust(v);
}

export function Nothing<V>(): Maybe<V> {
  return new ImplNothing();
}

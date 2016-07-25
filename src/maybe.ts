import {Functor} from "./functor";

type MaybeMatch<T, K> = {
  nothing: () => K,
  just: (t: T) => K
};

export abstract class Maybe<A> implements Functor<A> {
  abstract match<K>(m: MaybeMatch<any, K>): K;
  of: <B>(v: B) => Maybe<B> = of;
  abstract chain<B>(f: (v: any) => Maybe<B>): Maybe<A>;
  abstract map<B>(f: (a: A) => B): Maybe<B>;
}

function of<V>(v: V): Maybe<V> {
  return new ImplJust(v);
}

class ImplNothing<A> extends Maybe<A> {
  constructor() {
    super();
  };
  match<K>(m: MaybeMatch<any, K>): K {
    return m.nothing();
  }
  chain<B>(f: (v: any) => Maybe<B>): Maybe<A> {
    return this;
  }
  map<B>(f: (a: A) => B): Maybe<B> {
    return new ImplNothing<B>();
  }
}

class ImplJust<A> extends Maybe<A> {
  val: A;
  constructor(val: A) {
    super();
    this.val = val;
  }
  match<K>(m: MaybeMatch<A, K>): K {
    return m.just(this.val);
  }
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

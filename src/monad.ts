import {Applicative} from "./applicative";

function id<A>(a: A) {
  return a;
}

export interface Monad<A> extends Applicative<A> {
  chain<B>(f: (a: A) => Monad<B>): Monad<B>;
  flatten<B>(m: Monad<Monad<B>>): Monad<B>;
}

export abstract class AbstractMonad<A> implements Monad<A> {
  abstract of<B>(b: B): Monad<B>;
  abstract chain<B>(f: (a: A) => Monad<B>): Monad<B>;
  flatten<B>(m: Monad<Monad<B>>): Monad<B> {
    return m.chain(id);
  }
  map<B>(f: (a: A) => B): Monad<B> {
    return this.chain((a: A) => this.of(f(a)));
  }
  mapTo<B>(b: B): Monad<B> {
    return this.chain((_) => this.of(b));
  }
  lift<T1, R>(f: (t: T1) => R, m: Applicative<T1>): Applicative<R>;
  lift<T1, T2, R>(f: (t: T1, u: T2) => R, m1: Applicative<T1>, m2: Applicative<T2>): Applicative<R>;
  lift<T1, T2, T3, R>(f: (t1: T1, t2: T2, t3: T3) => R, m1: Applicative<T1>, m2: Applicative<T2>, m3: Applicative<T3>): Applicative<R>;
  lift(f: Function, ...ms: any[]): Monad<any> {
    const {of} = ms[0];
    switch (f.length) {
    case 1:
      return ms[0].map(f);
    case 2:
      return ms[0].chain((a: any) => ms[1].chain((b: any) => of(f(a, b))));
    case 3:
      return ms[0].chain((a: any) => ms[1].chain((b: any) => ms[2].chain((c: any) => of(f(a, b, c)))));
    }
  }
}

export function join<A>(m: Monad<Monad<A>>) {
  return m.chain(id);
}

export function Do(gen: () => Iterator<Monad<any>>): Monad<any> {
  const doing = gen();
  function doRec(v: any): Monad<any> {
    const a = doing.next(v);
    if (a.done === true) {
      return a.value;
    } else if (typeof a.value !== "undefined") {
      return a.value.chain(doRec);
    } else {
      throw new Error("Expected monad value");
    }
  }
  return doRec(undefined);
};

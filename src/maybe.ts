import {Monoid, MonoidConstructor} from "./monoid";
import {Applicative, ApplicativeDictionary} from "./applicative";
import {foldable, Foldable} from "./foldable";
import {Traversable} from "./traversable";
import {Monad} from "./monad";
import {Either} from "./either";
import {id} from "./utils";

export type MaybeMatch<T, K> = {
  nothing: () => K,
  just: (t: T) => K
};

export abstract class Maybe<A> implements Monad<A>, Foldable<A> {
  isMaybe: true;
  abstract match<K>(m: MaybeMatch<A, K>): K;
  of<B>(v: B): Maybe<B> {
    return just(v);
  }
  static of<B>(v: B): Maybe<B> {
    return just(v);
  }
  static is(a: any): a is Maybe<any> {
    return typeof a === "object" && a.isMaybe === true;
  }
  abstract chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;
  flatten<B>(): Maybe<any> {
    return (this as any).match({
      nothing: () => nothing,
      just: id
    });
  }
  abstract map<B>(f: (a: A) => B): Maybe<B>;
  abstract mapTo<B>(b: B): Maybe<B>;
  abstract ap<B>(a: Applicative<(a: A) => B>): Applicative<B>;
  lift<T1, R>(f: (t: T1) => R, m: Maybe<T1>): Maybe<R>;
  lift<T1, T2, R>(f: (t: T1, u: T2) => R, m1: Maybe<T1>, m2: Maybe<T2>): Maybe<R>;
  lift<T1, T2, T3, R>(f: (t1: T1, t2: T2, t3: T3) => R, m1: Maybe<T1>, m2: Maybe<T2>, m3: Maybe<T3>): Maybe<R>;
  lift(/* arguments */): any {
    const f = arguments[0];
    for (let i = 1; i < arguments.length; ++i) {
      if (isNothing(arguments[i])) { return nothing; }
    }
    switch (arguments.length - 1) {
    case 1:
      return just(f(arguments[1].val));
    case 2:
      return just(f(arguments[1].val, arguments[2].val));
    case 3:
      return just(f(arguments[1].val, arguments[2].val, arguments[3].val));
    }
  }
  abstract foldr<B>(f: (acc: A, b: B) => B, init: B): B;
  abstract foldl<B>(f: (acc: B, a: A) => B, init: B): B;
  shortFoldr: <B>(f: (a: A, b: B) => Either<B, B>, acc: B) => B;
  shortFoldl: <B>(f: (acc: B, a: A) => Either<B, B>, acc: B) => B;
  maximum: () => number;
  minimum: () => number;
  sum: () => number;
  abstract size(): number;
  abstract traverse<B>(a: ApplicativeDictionary, f: (a: A) => Applicative<B>): any;
  sequence<A>(
    a: ApplicativeDictionary,
    m: Maybe<Applicative<A>>
  ): any {
    return m.match({
      nothing: () => a.of(nothing),
      just: (v) => v.map(just)
    });
  }
  static multi: boolean = false;
  multi: boolean = false;
}

@foldable
class Nothing<A> extends Maybe<A> {
  constructor() {
    super();
    this.isMaybe = true;
  }
  match<K>(m: MaybeMatch<any, K>): K {
    return m.nothing();
  }
  chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {
    return nothing;
  }
  map<B>(f: (a: A) => B): Maybe<B> {
    return nothing;
  }
  mapTo<B>(b: B): Maybe<B> {
    return nothing;
  }
  ap<B>(a: Maybe<(a: A) => B>): Maybe<B> {
    return nothing;
  }
  foldr<B>(f: (a: A, acc: B) => B, init: B): B {
    return init;
  }
  foldl<B>(f: (acc: B, a: A) => B, init: B): B {
    return init;
  }
  size(): number {
    return 0;
  }
  traverse<B>(a: ApplicativeDictionary, f: (a: A) => Applicative<B>): any {
    return a.of(nothing);
  }
}

@foldable
class Just<A> extends Maybe<A> {
  val: A;
  constructor(val: A) {
    super();
    this.isMaybe = true;
    this.val = val;
  }
  match<K>(m: MaybeMatch<A, K>): K {
    return m.just(this.val);
  }
  chain<B>(f: (v: A) => Maybe<B>): Maybe<B> {
    return f(this.val);
  }
  map<B>(f: (a: A) => B): Maybe<B> {
    return new Just(f(this.val));
  }
  mapTo<B>(b: B): Maybe<B> {
    return new Just<B>(b);
  }
  ap<B>(m: Maybe<(a: A) => B>): Maybe<B> {
    return m.match({
      nothing: () => nothing,
      just: (f) => new Just(f(this.val))
    });
  }
  foldr<B>(f: (a: A, b: B) => B, init: B): B {
    return f(this.val, init);
  }
  foldl<B>(f: (acc: B, a: A) => B, init: B): B {
    return f(init, this.val);
  }
  size(): number {
    return 1;
  }
  traverse<B>(a: ApplicativeDictionary, f: (a: A) => Applicative<B>): any {
    return f(this.val).map(just);
  }
}

export function just<V>(v: V): Maybe<V> {
  return new Just(v);
}

export const nothing: Maybe<any> = new Nothing();

export function isNothing(m: Maybe<any>): boolean {
  return m === nothing;
}

export function isJust(m: Maybe<any>): boolean {
  return m !== nothing;
}

export function fromMaybe<A>(a: A, m: Maybe<A>): A {
  return m === nothing ? a : (<Just<A>>m).val;
}

export function maybe<A, B>(b: B, f: (a: A) => B, m: Maybe<A>): B {
  return m === nothing ? b : f((<Just<A>>m).val);
}

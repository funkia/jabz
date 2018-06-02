import { Monoid, MonoidConstructor } from "./monoid";
import { Applicative, ApplicativeDictionary, of, seq } from "./applicative";
import { Monad } from "./monad";
import { Maybe, just, nothing } from "./maybe";
import { Either, left, right, isRight, fromEither } from "./either";
import Endo from "./monoids/endo";
import { mixin, add, id, impurePush } from "./utils";

export interface Foldable<A> {
  foldr<B>(f: (a: A, acc: B) => B, acc: B): B;
  foldl<B>(f: (acc: B, a: A) => B, init: B): B;
  shortFoldr<B>(f: (a: A, acc: B) => Either<B, B>, acc: B): B;
  shortFoldl<B>(f: (acc: B, a: A) => Either<B, B>, acc: B): B;
  size(): number;
  maximum(): number;
  minimum(): number;
  sum(): number;
}

export type AnyFoldable<A> = Foldable<A> | A[];

function incr<A>(_: A, acc: number): number {
  return acc + 1;
}

export abstract class AbstractFoldable<A> implements Foldable<A> {
  abstract foldr<B>(f: (a: A, acc: B) => B, init: B): B;
  foldl<B>(f: (acc: B, a: A) => B, init: B): B {
    return this.foldr((a, r) => (acc: B) => r(f(acc, a)), id)(init);
  }
  shortFoldr<B>(f: (a: A, b: B) => Either<B, B>, acc: B): B {
    return fromEither(
      this.foldr(
        (a, eb) => (isRight(eb) ? f(a, fromEither(eb)) : eb),
        right(acc)
      )
    );
  }
  shortFoldl<B>(f: (b: B, a: A) => Either<B, B>, acc: B): B {
    return fromEither(
      this.foldl(
        (eb, a) => (isRight(eb) ? f(fromEither(eb), a) : eb),
        right(acc)
      )
    );
  }
  size(): number {
    return this.foldr<number>(incr, 0);
  }
  maximum(): number {
    return (<Foldable<number>>(<any>this)).foldr(Math.max, -Infinity);
  }
  minimum(): number {
    return (<Foldable<number>>(<any>this)).foldr(Math.min, Infinity);
  }
  sum(): number {
    return (<Foldable<number>>(<any>this)).foldr(add, 0);
  }
}

export function foldable(constructor: Function): void {
  const p = constructor.prototype;
  if (!("foldr" in p)) {
    throw new TypeError("Can't derive foldable. `foldr` method missing.");
  }
  mixin(constructor, [AbstractFoldable]);
}

export function foldMap<A, M extends Monoid<M>>(
  f: MonoidConstructor<A, M>,
  a: Foldable<A> | A[]
): M {
  return foldr((a, b) => f.create(a).combine(b), f.identity(), a);
}

export function foldr<A, B>(
  f: (a: A, b: B) => B,
  init: B,
  a: Foldable<A> | A[]
): B {
  if (a instanceof Array) {
    for (let i = a.length - 1; 0 <= i; --i) {
      init = f(a[i], init);
    }
    return init;
  } else {
    return a.foldr(f, init);
  }
}

export function foldl<A, B>(
  f: (acc: B, a: A) => B,
  init: B,
  a: Foldable<A> | A[]
): B {
  if (a instanceof Array) {
    for (let i = 0; i < a.length; ++i) {
      init = f(init, a[i]);
    }
    return init;
  } else {
    return a.foldl(f, init);
  }
}

export function size(a: Foldable<any> | any[]): number {
  if (a instanceof Array) {
    return a.length;
  } else {
    return a.size();
  }
}

export function isEmpty(a: AnyFoldable<any>): boolean {
  if (a instanceof Array) {
    return a.length === 0;
  } else {
    return a.shortFoldl((_, a) => left(false), true);
  }
}

export function take<A>(n: number, t: Foldable<A>): A[] {
  const list: A[] = [];
  if (n === 0) {
    return list;
  } else {
    return t.shortFoldl((list, a) => {
      list.push(a);
      return (list.length === n ? left : right)(list);
    }, list);
  }
}

export function find<A>(f: (a: A) => boolean, t: Foldable<A>): Maybe<A> {
  return t.shortFoldl((acc, a) => (f(a) ? left(just(a)) : right(acc)), nothing);
}

export function findLast<A>(f: (a: A) => boolean, t: Foldable<A>): Maybe<A> {
  return t.shortFoldr((a, acc) => (f(a) ? left(just(a)) : right(acc)), nothing);
}

export function findIndex<A>(
  f: (a: A) => boolean,
  t: Foldable<A>
): Maybe<number> {
  const idx = t.shortFoldl((idx, a) => (f(a) ? left(-idx) : right(idx - 1)), 0);
  return idx >= 0 ? just(idx) : nothing;
}

export function findLastIndex<A>(
  f: (a: A) => boolean,
  t: Foldable<A>
): Maybe<number> {
  const idx = t.shortFoldr(
    (a, idx) => (f(a) ? left(-idx) : right(idx - 1)),
    -1
  );
  return idx >= 0 ? just(t.size() - idx) : nothing;
}

export function shortFoldl<A, B>(
  f: (b: B, a: A) => Either<B, B>,
  acc: B,
  l: Foldable<A>
): B {
  return l.shortFoldl<B>(f, acc);
}

export function all<A>(
  pred: (a: A) => boolean,
  foldable: Foldable<A>
): boolean {
  return shortFoldl(
    (_, val) => (pred(val) === true ? right(true) : left(false)),
    true,
    foldable
  );
}

export function any<A>(
  pred: (a: A) => boolean,
  foldable: Foldable<A>
): boolean {
  return shortFoldl(
    (_, val) => (pred(val) === true ? left(true) : right(false)),
    false,
    foldable
  );
}

export function toArray<A>(t: Foldable<A> | A[]): A[] {
  if (Array.isArray(t)) {
    return t;
  } else {
    return t.foldl<A[]>(impurePush, []);
  }
}

export function sequence_(
  d: ApplicativeDictionary | ArrayConstructor,
  t: Foldable<Applicative<any>> | Array<Applicative<any>>
): any {
  return foldr(seq, of(d, undefined), t);
}

export function foldrM<A, B>(
  f: (a: A, b: B) => Monad<B>,
  mb: Monad<B>,
  t: Foldable<A> | A[]
): Monad<B> {
  return foldr((a, mb) => mb.chain(b => f(a, b)), mb, t);
}

export function maximum(t: Foldable<number>): number {
  return t.maximum();
}

export function minimum(t: Foldable<number>) {
  return t.minimum();
}

export function sum(t: Foldable<number>) {
  return t.sum();
}

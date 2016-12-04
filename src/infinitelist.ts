import {Functor} from "./functor";
import {Foldable} from "./foldable";
import {id, add, compose} from "./utils";
import {Either, fromEither, right, isRight, isLeft} from "./either";

export class InfiniteList<A> implements Functor<A>, Foldable<A> {
  constructor(private fn: (idx: number) => A) {};
  map<B>(f: (a: A) => B): InfiniteList<B> {
    return new InfiniteList(compose(f, this.fn));
  }
  mapTo<B>(b: B): InfiniteList<B> {
    return repeat(b);
  }
  of<B>(b: B): InfiniteList<B> {
    return repeat(b);
  }
  ap<B>(a: InfiniteList<(a: A) => B>): InfiniteList<B> {
    return new InfiniteList((i) => a.fn(i)(this.fn(i)));
  }
  lift<T1, R>(f: (t: T1) => R, m: InfiniteList<T1>): InfiniteList<R>;
  lift<T1, T2, R>(f: (t: T1, u: T2) => R, m1: InfiniteList<T1>, m2: InfiniteList<T2>): InfiniteList<R>;
  lift<T1, T2, T3, R>(f: (t1: T1, t2: T2, t3: T3) => R, m1: InfiniteList<T1>, m2: InfiniteList<T2>, m3: InfiniteList<T3>): InfiniteList<R>;
  lift(/* arguments */): any {
    return new InfiniteList((i) => {
      const vals: any[] = [];
      for (let j = 1; j < arguments.length; ++j) {
        vals[j - 1] = arguments[j].fn(i);
      }
      console.log(vals);
      return arguments[0].apply(undefined, vals);
    });
  }
  foldr<B>(f: (a: A, acc: B) => B, init: B): B {
    throw new Error("Cannot perform strict foldr on infinite list");
  }
  foldl<B>(f: (acc: B, a: A) => B, init: B): B {
    throw new Error("Cannot perform strict foldl on infinite list");
  }
  shortFoldr<B>(f: (a: A, b: B) => Either<B, B>, init: B): B {
    throw new Error("Cannot call shortFoldr on infinite list");
  }
  shortFoldl<B>(f: (b: B, a: A) => Either<B, B>, init: B): B {
    let acc = right(init);
    let idx = 0;
    while (isRight(acc)) {
      acc = f(fromEither(acc), this.fn(idx));
      idx++;
    }
    return fromEither(acc);
  }
  size(): number {
    return Infinity;
  }
  maximum(): number {
    return Infinity;
  }
  minimum(): number {
    return 0;
  }
  sum(): number {
    return Infinity;
  }
}

export function repeat<A>(a: A): InfiniteList<A> {
  return new InfiniteList((_) => a);
}

export const naturals = new InfiniteList(id);

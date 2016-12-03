import {Foldable} from "./foldable";
import {id, add} from "./utils";
import {Either, fromEither, right, isRight, isLeft} from "./either";

export class InfiniteList<A> implements Foldable<A> {
  constructor(private fn: (idx: number) => A) {};
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

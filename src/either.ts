import {Functor} from "./functor";

export type Either<A, B> = Left<A, B> | Right<A, B>;

type EitherMatch<A, B, K> = {
  left: (a: A) => K,
  right: (b: B) => K
}

class Left<A, B> implements Functor<B> {
  val: A;
  constructor(a: A) {
    this.val = a;
  }
  match<K>(m: EitherMatch<A, B, K>): K {
    return m.left(this.val);
  }
  map<C>(f: (b: B) => C): Either<A, C> {
    // return this as Left<A, C>;
    return new Left<A, C>(this.val);
  }
  mapTo<C>(c: C): Either<A, C> {
    return new Left<A, C>(this.val);
  }
}

class Right<A, B> implements Functor<B> {
  val: B;
  constructor(b: B) {
    this.val = b;
  }
  match<K>(m: EitherMatch<A, B, K>): K {
    return m.right(this.val);
  }
  map<C>(f: (b: B) => C): Either<A, C> {
    // return this as Left<A, C>;
    return new Right<A, C>(f(this.val));
  }
  mapTo<C>(c: C): Either<A, C> {
    return new Right<A, C>(c);
  }
}

export function left<A, B>(a: A): Either<A, B> {
  return new Left(a);
}

export function right<A, B>(b: B): Either<A, B> {
  return new Right(b);
}

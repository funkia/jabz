import {Functor} from "./functor";
import {Applicative} from "./applicative";

export enum EitherTag { Left, Right }

export type EitherMatch<A, B, K> = {
  left: (a: A) => K,
  right: (b: B) => K
}

export abstract class Either<A, B> implements Applicative<B> {
  tag: EitherTag;
  val: A | B;
  abstract match<K>(m: EitherMatch<A, B, K>): K;
  abstract map<C>(f: (b: B) => C): Either<A, C>;
  abstract mapTo<C>(c: C): Either<A, C>;
  static of<A, B>(b: B): Either<A, B> {
    return new Right(b);
  }
  of<B>(b: B): Either<A, B> {
    return new Right(b);
  }
  ap<C>(a: Either<A, (a: B) => C>): Either<B, C> {
    if (a.tag === EitherTag.Left) {
      return <any>a;
    } else {
      return <any>this.map(<any>a.val);
    }
  }
  lift<A, T1, R>(f: (t: T1) => R, m: Either<A, T1>): Either<A, R>;
  lift<A, T1, T2, R>(f: (t: T1, u: T2) => R, m1: Either<A, T1>, m2: Either<A, T2>): Either<A, R>;
  lift<A, T1, T2, T3, R>(f: (t1: T1, t2: T2, t3: T3) => R, m1: Either<A, T1>, m2: Either<A, T2>, m3: Either<A, T3>): Either<A, R>;
  lift<A>(f: Function, ...args: Either<A, any>[]): Either<A, any> {
    for (let i = 0; i < args.length; i++) {
      if (args[i].tag === EitherTag.Left) {
        return args[i];
      }
    }
    let rights: Right<A, any>[] = [];
    for (let i = 0; i < args.length; i++) {
      rights.push(args[i].val);
    }
    return new Right(f(...rights));
  }
}

export class Left<A, B> extends Either<A, B> {
  val: A;
  tag: EitherTag = EitherTag.Left;
  constructor(a: A) {
    super();
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

export class Right<A, B> extends Either<A, B> {
  val: B;
  tag: EitherTag = EitherTag.Right;
  constructor(b: B) {
    super();
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

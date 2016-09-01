import {Functor} from "./functor";
import {Either} from "./either";

export interface ApplicativeDictionary {
  of: <B>(b: B) => Applicative<B>;
}

export interface Applicative<A> extends Functor<A> {
  of: <B>(b: B) => Applicative<B>;
  lift<T1, R>(f: (t: T1) => R, m: Applicative<T1>): Applicative<R>;
  lift<T1, T2, R>(f: (t: T1, u: T2) => R, m1: Applicative<T1>, m2: Applicative<T2>): Applicative<R>;
  lift<T1, T2, T3, R>(f: (t1: T1, t2: T2, t3: T3) => R, m1: Applicative<T1>, m2: Applicative<T2>, m3: Applicative<T3>): Applicative<R>;
  map<B>(f: (a: A) => B): Applicative<B>;
}

export function lift<A, T1, R>(f: (t: T1) => R, m: Either<A, T1>): Either<A, R>;
export function lift<A, T1, T2, R>(f: (t: T1, u: T2) => R, m1: Either<A, T1>, m2: Either<A, T2>): Either<A, R>;
export function lift<A, T1, T2, T3, R>(f: (t1: T1, t2: T2, t3: T3) => R, m1: Either<A, T1>, m2: Either<A, T2>, m3: Either<A, T3>): Either<A, R>;
export function lift(f: Function, ...args: Applicative<any>[]): any {
  const {lift}: {lift: Function} = args[0];
  return lift(f, ...args);
}

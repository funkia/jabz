import {Functor} from "./functor";
import {Either} from "./either";

export interface ApplicativeDictionary {
  of: <B>(b: B) => Applicative<B>;
}

export interface Applicative<A> extends Functor<A> {
  of: <B>(b: B) => Applicative<B>;
  ap<B>(a: Applicative<(a: A) => B>): Applicative<B>;
  lift<T1, R>(f: (t: T1) => R, m: Applicative<T1>): Applicative<R>;
  lift<T1, T2, R>(f: (t: T1, u: T2) => R, m1: Applicative<T1>, m2: Applicative<T2>): Applicative<R>;
  lift<T1, T2, T3, R>(f: (t1: T1, t2: T2, t3: T3) => R, m1: Applicative<T1>, m2: Applicative<T2>, m3: Applicative<T3>): Applicative<R>;
  map<B>(f: (a: A) => B): Applicative<B>;
}

function isArrayConstructor(a: any): a is ArrayConstructor {
  return a === Array;
}

export function of<A>(d: ArrayConstructor, a: A): A[];
export function of<A>(d: ApplicativeDictionary, a: A): any;
export function of<A>(d: ApplicativeDictionary | ArrayConstructor, a: A): any {
  if (isArrayConstructor(d)) {
    return [a];
  } else {
    return d.of(a);
  }
}

function arrayLift(f: Function, args: any[][], indices: number[]): any[] {
  if (args.length === indices.length) {
    let values: any[] = [];
    for (let i = 0; i < args.length; ++i) {
      values[i] = args[i][indices[i]];
    }
    return [f.apply(undefined, values)];
  } else {
    let results: any[] = [];
    for (let i = 0; i < args[indices.length].length; ++i) {
      results = results.concat(arrayLift(f, args, indices.concat(i)));
    }
    return results;
  }
}

export function lift<A, T1, R>(f: (t: T1) => R, m: Either<A, T1>): Either<A, R>;
export function lift<A, T1, T2, R>(f: (t: T1, u: T2) => R, m1: Either<A, T1>, m2: Either<A, T2>): Either<A, R>;
export function lift<A, T1, T2, T3, R>(f: (t1: T1, t2: T2, t3: T3) => R, m1: Either<A, T1>, m2: Either<A, T2>, m3: Either<A, T3>): Either<A, R>;
export function lift<A, R>(f: (t: A) => R, a: A[]): R[];
export function lift<A, B, R>(f: (a: A, b: B) => R, a: A[], b: B[]): R[];
export function lift<A, B, C, R>(f: (a: A, b: B, c: B) => R, a: A[], b: B[], c: C[]): R[];
export function lift(f: Function, ...args: any[]): any {
  if (Array.isArray(args[0])) {
    return arrayLift(f, args, []);
  } else {
    return args[0].lift(f, ...args);
  }
}

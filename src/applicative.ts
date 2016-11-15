import {Functor, AbstractFunctor} from "./functor";
import {Either} from "./either";
import {curry2, curry3} from "./curry";
import {mixin} from "./utils";

function apply<A, B>(f: (a: A) => B, a: A): B {
  return f(a);
}

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

export abstract class AbstractApplicative<A> extends AbstractFunctor<A> implements Applicative<A> {
  abstract of<B>(b: B): Applicative<B>;
  ap<B>(f: Applicative<(a: A) => B>): Applicative<B> {
    return this.lift(apply, f, this)
  }
  lift<T1, R>(f: (t: T1) => R, m: Applicative<T1>): Applicative<R>;
  lift<T1, T2, R>(f: (t: T1, u: T2) => R, m1: Applicative<T1>, m2: Applicative<T2>): Applicative<R>;
  lift<T1, T2, T3, R>(f: (t1: T1, t2: T2, t3: T3) => R, m1: Applicative<T1>, m2: Applicative<T2>, m3: Applicative<T3>): Applicative<R>;
  lift(/* arguments */): any {
    const f = arguments[0];
    switch (arguments.length - 1) {
    case 1:
      return arguments[1].map(f);
    case 2:
      return arguments[2].ap(arguments[1].map(curry2(f)));
    case 3:
      return arguments[3].ap(arguments[2].ap(arguments[1].map(curry3(f))));
    }
  }
  map<B>(f: (a: A) => B): Applicative<B> {
    return this.ap(this.of(f));
  }
}

export function applicative(constructor: Function): void {
  const prototype = constructor.prototype;
  if (!("of" in prototype)) {
    throw new TypeError("Can't derive applicative. `of` method missing.");
  }
  if (!("ap" in prototype) && !("lift" in prototype)) {
    throw new TypeError("Can't derive applicative. Either `lift` or `ap` method must be defined.");
  }
  mixin(constructor, [AbstractFunctor, AbstractApplicative]);
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

export function ap<A, B>(fa: Applicative<(a: A) => B>, ba: Applicative<A>): any {
  return ba.ap(fa);
}

export function lift<T1, R>(f: (t: T1) => R, m: Applicative<T1>): any;
export function lift<T1, T2, R>(f: (t: T1, u: T2) => R, m1: Applicative<T1>, m2: Applicative<T2>): any;
export function lift<T1, T2, T3, R>(f: (t1: T1, t2: T2, t3: T3) => R, m1: Applicative<T1>, m2: Applicative<T2>, m3: Applicative<T3>): any;
// Either
export function lift<A, T1, R>(f: (t: T1) => R, m: Either<A, T1>): Either<A, R>;
export function lift<A, T1, T2, R>(f: (t: T1, u: T2) => R, m1: Either<A, T1>, m2: Either<A, T2>): Either<A, R>;
export function lift<A, T1, T2, T3, R>(f: (t1: T1, t2: T2, t3: T3) => R, m1: Either<A, T1>, m2: Either<A, T2>, m3: Either<A, T3>): Either<A, R>;
// Native array
export function lift<A, R>(f: (t: A) => R, a: A[]): R[];
export function lift<A, B, R>(f: (a: A, b: B) => R, a: A[], b: B[]): R[];
export function lift<A, B, C, R>(f: (a: A, b: B, c: B) => R, a: A[], b: B[], c: C[]): R[];
// implementation
export function lift(f: Function, ...args: any[]): any {
  if (Array.isArray(args[0])) {
    return arrayLift(f, args, []);
  } else {
    return args[0].lift(f, ...args);
  }
}

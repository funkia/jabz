import {Maybe} from "./maybe";
import {Either} from "./either";
import {mixin} from "./utils";

function arrayMap<A, B>(f: (a: A) => B, as: A[]): B[] {
  let newArr: B[] = [];
  for (const a of as) { newArr.push(f(a)); }
  return newArr;
}

function repeat<A>(a: A, length: number): A[] {
  let newArr: A[] = [];
  for (let i = 0; i < length; ++i) { newArr.push(a); }
  return newArr;
}

export interface Functor<A> {
  map<B>(f: (a: A) => B): Functor<B>;
  mapTo<B>(b: B): Functor<B>;
}

export type AnyFunctor<A> = A[] | Functor<A>;

export abstract class AbstractFunctor<A> implements Functor<A> {
  abstract map<B>(f: (a: A) => B): Functor<B>;
  mapTo<B>(b: B): Functor<B> {
    return this.map((_: A) => b);
  }
}

export function functor(constructor: Function): void {
  if (!("map" in constructor.prototype)) {
    throw new TypeError("Can't derive functor. `map` method missing.");
  }
  mixin(constructor, [AbstractFunctor]);
}

export function map<A, B>(f: (a: A) => B, functor: Maybe<A>): Maybe<B>;
export function map<A, B, C>(f: (b: B) => C, functor: Either<A, B>): Either<A, C>;
export function map<A, B>(f: (a: A) => B, functor: Functor<A>): any;
export function map<A, B>(f: (a: A) => B, functor: A[]): B[];
export function map<A, B>(f: (a: A) => B, functor: any): any;
export function map<A, B>(f: (a: A) => B, functor: Functor<A> | A[]): Functor<B> | B[] {
  if (Array.isArray(functor)) {
    return arrayMap(f, functor);
  } else {
    return functor.map(f);
  }
}

export function mapTo<A, B>(b: B, functor: Maybe<A>): Maybe<B>;
export function mapTo<A, B, C>(c: C, functor: Either<A, B>): Either<A, C>;
export function mapTo<A, B>(b: B, functor: A[]): B[];
export function mapTo<A, B>(b: B, functor: Functor<A>): any;
export function mapTo<A, B>(b: B, functor: any): any;
export function mapTo<A, B>(b: B, functor: Functor<A> | A[]): Functor<B> | B[] {
  if (Array.isArray(functor)) {
    return repeat(b, functor.length);
  } else {
    return functor.mapTo(b);
  }
}

export function mapMap<A, B>(f: (a: A) => B, functor: AnyFunctor<AnyFunctor<A>>): any;
export function mapMap<A, B>(f: (a: A) => B, functor: any): any {
  return map((fa: any) => map(f, fa), functor);
}

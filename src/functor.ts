import {Maybe} from "./maybe";

export interface Functor<A> {
  map<B>(f: (a: A) => B): Functor<B>;
  mapTo<B>(b: B): Functor<B>;
}

export function map<A, B>(f: (a: A) => B, functor: Maybe<A>): Maybe<B>;
export function map<A, B>(f: (a: A) => B, functor: Functor<A>): Functor<B>;
export function map<A, B>(f: (a: A) => B, functor: Functor<A>): Functor<B> {
  return functor.map(f);
}

export function mapTo<A, B>(b: B, functor: Maybe<A>): Maybe<B>;
export function mapTo<A, B>(b: B, functor: Functor<A>): Functor<B> {
  return functor.mapTo(b);
}

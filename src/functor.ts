export interface Functor<A> {
  map<B>(f: (a: A) => B): Functor<B>;
}

export function map<A, B>(fn: (a: A) => B, functor: Functor<A>): Functor<B> {
  return functor.map(fn);
}

export function mapTo<A, B>(b: B, functor: Functor<A>): Functor<B> {
  return functor.map(_ => b);
}

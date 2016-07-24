export interface Semigroup<A> {
  merge: (a: Semigroup<A>) => Semigroup<A>;
}

export function merge<A>(a: Semigroup<A>, b: Semigroup<A>): Semigroup<A> {
  return a.merge(b);
}

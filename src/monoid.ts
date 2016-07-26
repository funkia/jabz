import {Semigroup, merge} from "./semigroup";

export interface Monoid<A> extends Semigroup<A> {
  identity: A;
}

export function identity<A extends Monoid<A>>(m: A): A {
  return m.identity;
}

export interface MonoidConstructor<A, M extends Monoid<M>> {
  (a: A): M;
  identity: M;
}

export {merge};

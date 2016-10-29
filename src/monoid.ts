import {Semigroup, combine} from "./semigroup";

export interface Monoid<A> extends Semigroup<A> {
  identity: () => A;
}

export interface MonoidDictionary<M extends Monoid<M>> {
  identity: () => M;
}

export interface MonoidConstructor<A, M extends Monoid<M>> {
  create(a: A): M;
  identity: () => M;
}

export function identity(m: StringConstructor): string;
export function identity<M extends Monoid<M>>(m: MonoidDictionary<M>): M;
export function identity<M extends Monoid<M>>(m: any): any {
  if (m === String) {
    return "";
  } else {
    return m.identity();
  }
}

export {combine};

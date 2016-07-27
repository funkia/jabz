import {Monoid, MonoidConstructor} from "./monoid";

export interface Foldable<A> {
  foldMap<M extends Monoid<M>>(f: MonoidConstructor<A, M>): M;
}

import {Semigroup} from "./semigroup";

export interface Monoid<A> extends Semigroup<A> {
  identity: Monoid<A>;
}

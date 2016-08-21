import {Functor} from "./functor";
import {Foldable} from "./foldable";
import {Applicative} from "./applicative";

export interface Traversable<A> extends Functor<A>, Foldable<A> {
  traverse<B>(f: (a: A) => Applicative<B>): Applicative<Traversable<B>>;
}

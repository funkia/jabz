import {Functor} from "./functor";
import {Foldable} from "./foldable";
import {Applicative, ApplicativeDictionary} from "./applicative";

export interface Traversable<A> extends Functor<A>, Foldable<A> {
  traverse<B>(a: ApplicativeDictionary, f: (a: A) => Applicative<B>): Applicative<Traversable<B>>;
}

export function traverse<A, B>(
  a: ApplicativeDictionary,
  f: (a: A) => Applicative<B>,
  t: Traversable<A>
): Applicative<Traversable<B>> {
  return t.traverse(a, f);
}

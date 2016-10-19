import {Functor} from "./functor";
import {Foldable} from "./foldable";
import {Applicative, ApplicativeDictionary} from "./applicative";

export interface Traversable<A> extends Functor<A>, Foldable<A> {
  traverse<B>(
    a: ApplicativeDictionary,
    f: (a: A) => Applicative<B>
  ): Applicative<Traversable<B>>;
  sequence<A>(
    a: ApplicativeDictionary,
    t: Traversable<Applicative<A>>
  ): Applicative<Traversable<A>>;
}

function push<A>(a: A, as: A[]): A[] {
  as.push(a);
  return as;
}

function arraySequence<A>(
  a: ApplicativeDictionary,
  t: Applicative<A>[]
): Applicative<A[]> {
  let result = a.of<A[]>([]);
  const lift = result.lift;
  for (const elm of t) {
    result = lift(push, elm, result)
  }
  return result;
}

function arrayTraverse<A, B>(
  a: ApplicativeDictionary,
  f: (a: A) => Applicative<B>,
  t: A[]
): Applicative<B[]> {
  let result = a.of<B[]>([]);
  const lift = result.lift;
  for (const elm of t) {
    result = lift(push, f(elm), result)
  }
  return result;
}

export function sequence<A>(
  a: ApplicativeDictionary,
  t: Traversable<Applicative<A>> | Applicative<A>[]
): Applicative<Traversable<A>> | Applicative<A[]> {
  if (t instanceof Array) {
    return arraySequence(a, t);
  } else {
    return t.sequence(a, t);
  }
}

// Fixme: Use overload instead
export function traverse<A, B>(
  a: ApplicativeDictionary,
  f: (a: A) => Applicative<B>,
  t: Traversable<A> | A[]
): Applicative<Traversable<B> | B[]> {
  if (t instanceof Array) {
    return arrayTraverse(a, f, t);
  } else {
    return t.traverse(a, f);
  }
}

import {Functor} from "./functor";
import {Foldable, AbstractFoldable} from "./foldable";
import {Applicative, AbstractApplicative, ApplicativeDictionary} from "./applicative";
import Identity from "./identity";
import Endo from "./monoids/endo";
import {ConstEndo} from "./const";
import {id, mixin, cons} from "./utils";

export interface Traversable<A> extends Functor<A>, Foldable<A> {
  traverse<B>(
    a: ApplicativeDictionary,
    f: (a: A) => Applicative<B>
  ): Applicative<Traversable<B>>;
  sequence<B>(
    a: ApplicativeDictionary,
    t: Traversable<Applicative<B>>
  ): Applicative<Traversable<B>>;
}

export abstract class AbstractTraversable<A> extends AbstractFoldable<A> implements Traversable<A> {
  map<B>(f: (a: A) => B): Traversable<B> {
    return (<any>this.traverse(Identity, (a: A) => Identity.of(f(a)))).extract();
  }
  mapTo<B>(b: B): Functor<B> {
    return this.map((_: A) => b);
  }
  traverse<B>(
    a: ApplicativeDictionary,
    f: (a: A) => Applicative<B>
  ): Applicative<Traversable<B>> {
    return this.sequence(a, this.map(f));
  }
  sequence<A>(
    a: ApplicativeDictionary,
    t: Traversable<Applicative<A>>
  ): Applicative<Traversable<A>> {
    return t.traverse(a, id);
  }
  foldr<B>(f: (a: A, b: B) => B, acc: B): B {
    const f2 = (a: A) => new ConstEndo<B, B>(new Endo((b: B) => f(a, b)));
    return Endo.toFunction(
      (<ConstEndo<B, B>><any>this.traverse(ConstEndo, f2)).get()
    )(acc);
  }
}

export function traversable(constructor: Function): void {
  const p = constructor.prototype;
  if (!("map" in p && "sequence" in p) && !("traverse" in p)) {
    throw new TypeError("Can't derive traversable. Either `traverse` or `map` and `sequence` must be defined.");
  }
  mixin(constructor, [AbstractTraversable, AbstractFoldable]);
}

function arraySequence<A>(
  a: ApplicativeDictionary,
  t: Applicative<A>[]
): Applicative<A[]> {
  let result = a.of<A[]>([]);
  const lift = result.lift;
  for (let i = t.length - 1; i >= 0; --i) {
    result = lift<A, A[], A[]>(cons, t[i], result);
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
  for (let i = t.length - 1; i >= 0; --i) {
    result = lift<B, B[], B[]>(cons, f(t[i]), result);
  }
  return result;
}

export function sequence<A>(a: ApplicativeDictionary, t: Applicative<A>[]): any;
export function sequence<A>(a: ApplicativeDictionary, t: Traversable<Applicative<A>>): any;
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

export function traverse<A, B>(a: ApplicativeDictionary, f: (a: A) => Applicative<B>, t: A[]): any;
export function traverse<A, B>(a: ApplicativeDictionary, f: (a: A) => Applicative<B>, t: Traversable<A>): any;
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

class AnApplicative<A, B> extends AbstractApplicative<B> {
  constructor(private f: (a: A) => [A, B]) {
    super();
  }
  of<B>(b: B): AnApplicative<any, any> {
    return new AnApplicative((a: any) => [a, b]);
  }
  static of<B>(b: B): AnApplicative<any, any> {
    return new AnApplicative((a: any) => [a, b]);
  }
  ap<C>(fa: AnApplicative<A, (b: B) => C>): AnApplicative<A, C> {
    return new AnApplicative((a: A) => {
      const [a1, b] = this.f(a);
      const [a2, f] = fa.f(a1);
      return [a2, f(b)];
    });
  }
  run(a: A): [A, B] {
    return this.f(a);
  }
}

export function mapAccumR<A, B, C>(
  f: (acc: C, a: A) => [C, B], init: C, t: Traversable<A>
): [C, Traversable<B>] {
  return (<any>t.traverse(AnApplicative, (a: A) => new AnApplicative((c: C) => f(c, a)))).run(init);
}

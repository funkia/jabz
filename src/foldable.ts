import {Monoid, MonoidConstructor} from "./monoid";
import {Endo, toFunction} from "./monoids/endo";

export interface Foldable<A> {
  foldMapId<M extends Monoid<M>>(id: M, f: (a: A) => M): M;
  foldMap<M extends Monoid<M>>(f: MonoidConstructor<A, M>): M;
  fold<B>(acc: B, f: (a: A, b: B) => B): B;
  size(): number;
}

function part<A, B>(f: (a: A, b: B) => B, a: A): (b: B) => B {
  return (b: B) => f(a, b);
}

function incr<A>(_: A, acc: number): number {
  return acc + 1;
}

export abstract class AbstractFoldable<A> implements Foldable<A> {
  abstract foldMapId<M extends Monoid<M>>(id: M, f: (a: A) => M): M;
  foldMap<M extends Monoid<M>>(f: MonoidConstructor<A, M>): M {
    return this.foldMapId(f.identity(), f);
  }
  fold<B>(acc: B, f: (a: A, b: B) => B): B {
    return toFunction(this.foldMapId(Endo.identity(), (a: A) => Endo(part(f, a))))(acc);
  }
  size(): number {
    return this.fold(0, incr);
  }
}

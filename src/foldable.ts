import {Monoid, MonoidConstructor} from "./monoid";
import {Endo, toFunction} from "./monoids/endo";

export interface Foldable<A> {
  foldMapId<M extends Monoid<M>>(id: M, f: (a: A) => M): M;
  fold<B>(f: (a: A, b: B) => B, acc: B): B;
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
  fold<B>(f: (a: A, b: B) => B, acc: B): B {
    return toFunction(this.foldMapId(Endo.identity(), (a: A) => Endo(part(f, a))))(acc);
  }
  size(): number {
    return this.fold<number>(incr, 0);
  }
}

export function foldMapId<A, M extends Monoid<M>>(id: M, f: (a: A) => M, a: Foldable<A>): M {
  return a.foldMapId(id , f);
}

export function foldMap<A, M extends Monoid<M>>(f: MonoidConstructor<A, M>, a: Foldable<A>): M {
  return a.foldMapId(f.identity(), f);
}

export function fold<A, B>(f: (a: A, b: B) => B, acc: B, a: Foldable<A>): B {
  return a.fold(f, acc);
}

export function size(a: Foldable<any>): number {
  return a.size();
}

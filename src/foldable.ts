
/**
 * Module containing Foldable
 * @module Foldable
 */

import {Monoid, MonoidConstructor, combine} from "./monoid";
import {Maybe, just, nothing} from "./maybe";
import {Either, left, right, isRight, fromEither} from "./either";
import Endo from "./monoids/endo";
import {mixin, add} from "./utils";

/**
 * A Foldable is any structure that supports a fold operation that
 * reduces the structure to a single value by applying an accumulator.
 *
 * @interface Foldable
 */

/**
 * Fold a foldable.
 *
 * @function
 * @name module:Foldable~Foldable#fold
 * @param {reducer} accumulator
 * @param {A} initial - In the first invocation of the function this is passed as the first argument.
 * @return {number} size
 */
export interface Foldable<A> {
  foldr<B>(f: (a: A, b: B) => B, acc: B): B;
  shortFoldr<B>(f: (a: A, b: B) => Either<B, B>, acc: B): B;
  size(): number;
  maximum(): number;
  minimum(): number;
  sum(): number;
}

function incr<A>(_: A, acc: number): number {
  return acc + 1;
}

export abstract class AbstractFoldable<A> implements Foldable<A> {
  abstract foldr<B>(f: (a: A, b: B) => B, acc: B): B;
  shortFoldr<B>(f: (a: A, b: B) => Either<B, B>, acc: B): B {
    return fromEither(this.foldr(
      (a, eb) => isRight(eb) ? f(a, fromEither(eb)) : eb, right(acc)
    ));
  }
  size(): number {
    return this.foldr<number>(incr, 0);
  }
  maximum(): number {
    return (<Foldable<number>><any>this).foldr(Math.max, -Infinity);
  }
  minimum(): number {
    return (<Foldable<number>><any>this).foldr(Math.min, Infinity);
  }
  sum(): number {
    return (<Foldable<number>><any>this).foldr(add, 0);
  }
}

export function foldable(constructor: Function): void {
  const p = constructor.prototype;
  if (!("foldr" in p)) {
    throw new TypeError("Can't derive foldable. `foldr` method missing.");
  }
  mixin(constructor, [AbstractFoldable]);
}

export function foldMap<A, M extends Monoid<M>>(f: MonoidConstructor<A, M>, a: Foldable<A> | A[]): M {
  return foldr((a, b) => b.combine(f.create(a)), f.identity(), a);
}

/**
 * Performs a right fold over a foldable.
 * @param {reducer} accumulator
 * @param {A} initial - In the first invocation of the function this is passed as the first argument.
 * @param {module:Foldable~Foldable} foldable
 * @return {B} size
 */
export function foldr<A, B>(f: (a: A, b: B) => B, acc: B, a: Foldable<A> | A[]): B {
  if (a instanceof Array) {
    for (const elm of a) {
      acc = f(elm, acc);
    }
    return acc;
  } else {
    return a.foldr(f, acc);
  }
}

/**
 * Return the size of a foldable.
 * @param {Foldable<any>} foldable
 * @return {number} size
 */
export function size(a: Foldable<any> | any[]): number {
  if (a instanceof Array) {
    return a.length;
  } else {
    return a.size();
  }
}

export function maximum(t: Foldable<number>): number {
  return t.maximum();
}

export function minimum(t: Foldable<number>) {
  return t.minimum();
}

export function sum(t: Foldable<number>) {
  return t.sum();
}

export function find<A>(f: (a: A) => boolean, t: Foldable<A>): Maybe<A> {
  return t.shortFoldr(
    (a, acc) => f(a) ? left(just(a)) : right(nothing), nothing
  );
}

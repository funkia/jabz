
/**
 * Module containing Foldable
 * @module Foldable
 */

import {Monoid, MonoidConstructor, combine} from "./monoid";
import Endo from "./monoids/endo";
import {mixin} from "./utils";

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
42; // Magic number to preserve JSDoc above

export interface Foldable<A> {
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
  abstract fold<B>(f: (a: A, b: B) => B, acc: B): B;
  size(): number {
    return this.fold<number>(incr, 0);
  }
}

export function foldable(constructor: Function): void {
  const p = constructor.prototype;
  if (!("fold" in p)) {
    throw new TypeError("Can't derive foldable. `foldable` method missing.");
  }
  mixin(constructor, [AbstractFoldable]);
}

export function foldMap<A, M extends Monoid<M>>(f: MonoidConstructor<A, M>, a: Foldable<A> | A[]): M {
  return fold((a, b) => b.combine(f.create(a)), f.identity(), a);
}

/**
 * Performs a right fold over a foldable.
 * @param {reducer} accumulator
 * @param {A} initial - In the first invocation of the function this is passed as the first argument.
 * @param {module:Foldable~Foldable} foldable
 * @return {B} size
 */
export function fold<A, B>(f: (a: A, b: B) => B, acc: B, a: Foldable<A> | A[]): B {
  if (a instanceof Array) {
    for (const elm of a) {
      acc = f(elm, acc);
    }
    return acc;
  } else {
    return a.fold(f, acc);
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

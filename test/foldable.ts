import "mocha";
import {assert} from "chai";

import {
  Foldable, foldable, foldMap, fold, size, maximum, minimum, sum, find
} from "../src/foldable";
import {just, nothing} from "../src/maybe";
import {Either, left, right} from "../src/either";
import {Monoid, MonoidConstructor} from "../src/monoid";
import Sum from "../src/monoids/sum";

@foldable
class List<A> implements Foldable<A> {
  constructor(private arr: A[]) {};
  fold<B>(f: (a: A, b: B) => B, acc: B): B {
    for (let i = 0; i < this.arr.length; ++i) {
      acc = f(this.arr[i], acc);
    }
    return acc;
  }
  shortFoldr: <B>(f: (a: A, b: B) => Either<B, B>, acc: B) => B;
  size: () => number;
  maximum: () => number;
  minimum: () => number;
  sum: () => number;
}

const list = <A>(arr: A[]) => new List(arr)

describe("Foldable", () => {
  describe("derived foldable implementation", () => {
    it("can't derive without `fold` method", () => {
      assert.throws(() => {
        @foldable
        class NotAFoldable<A> {
          constructor(private arr: A[]) {};
        }
      });
    });
    it("has foldMap", () => {
      assert.deepEqual(foldMap(Sum, new List([1, 2, 3, 4, 5])), Sum.create(15));
    });
    it("empty foldable gives identity element", () => {
      assert.deepEqual(foldMap(Sum, new List([])), Sum.create(0));
    });
    it("has fold", () => {
      assert.deepEqual(
        (new List([1, 2, 3, 4, 5])).fold((n, m) => n + m, 0), 15
      );
      assert.deepEqual(
        fold((n, m) => n + m, 0, new List([1, 2, 3, 4, 5])), 15
      );
    });
    it("has short-circuiting fold", () => {
      assert.deepEqual(
        list([1, 2, 3, 4, 5]).shortFoldr((n, m) => right(n + m), 0), 15
      );
      assert.deepEqual(
        list([1, 2, 3, 4, 5])
          .shortFoldr((n, m) => n === 4 ? left(m) : right(n + m), 0), 6
      );
    });
    it("has size", () => {
      assert.deepEqual(size(new List([1, 1, 1, 1])), 4);
    });
    it("can get `maximum`", () => {
      assert.deepEqual(maximum((new List([1, 2, 4, 3]))), 4);
    });
    it("can get `minimum`", () => {
      assert.deepEqual(minimum((new List([3, 2, 1, 3]))), 1);
    });
    it("can get `sum`", () => {
      assert.deepEqual(sum((new List([1, 2, 3, 4]))), 10);
    });
    it("can find element", () => {
      assert.deepEqual(
        just(3),
        find((n) => n === 3, list([1, 2, 3, 4, 5]))
      );
      assert.deepEqual(
        nothing(),
        find((n) => n === 3.5, list([1, 2, 3, 4, 5]))
      );
    });
  });
});

import "mocha";
import {assert} from "chai";

import {
  Foldable, foldable, foldMap, foldr, size, maximum, minimum, sum, find
} from "../src/foldable";
import {just, nothing} from "../src/maybe";
import {Either, left, right} from "../src/either";
import {Monoid, MonoidConstructor} from "../src/monoid";
import Sum from "../src/monoids/sum";

export function testFoldable(list: <A>(l: A[]) => Foldable<A>) {
  it("has foldMap", () => {
    assert.deepEqual(foldMap(Sum, list([1, 2, 3, 4, 5])), Sum.create(15));
  });
  it("empty foldable gives identity element", () => {
    assert.deepEqual(foldMap(Sum, list([])), Sum.create(0));
  });
  it("has foldr", () => {
    assert.deepEqual(
      (list([1, 2, 3, 4, 5])).foldr((n, m) => n + m, 0), 15
    );
    assert.deepEqual(
      foldr((n, m) => n + m, 0, list([1, 2, 3, 4, 5])), 15
    );
  });
  it("folds in right direction", () => {
    assert.deepEqual(
      (12 - (3 - (4 - 1))),
      foldr((n, m) => n - m, 1, list([12, 3, 4]))
    );
  });
  it("has short-circuiting fold", () => {
    assert.deepEqual(
      list([1, 2, 3, 4, 5]).shortFoldr((n, m) => right(n + m), 0), 15
    );
    assert.deepEqual(
      list([1, 2, 3, 4, 5])
        .shortFoldr((n, m) => n === 3 ? left(m) : right(n + m), 0), 9
    );
  });
  it("has size", () => {
    assert.deepEqual(size(list([1, 1, 1, 1])), 4);
  });
  it("can get `maximum`", () => {
    assert.deepEqual(maximum((list([1, 2, 4, 3]))), 4);
  });
  it("can get `minimum`", () => {
    assert.deepEqual(minimum((list([3, 2, 1, 3]))), 1);
  });
  it("can get `sum`", () => {
    assert.deepEqual(sum((list([1, 2, 3, 4]))), 10);
  });
  it("can find element", () => {
    assert.deepEqual(
      just(3),
      find((n) => n === 3, list([1, 2, 3, 4, 5]))
    );
    assert.deepEqual(
      just(8),
      find((n) => n > 6, list([1, 8, 3, 7, 5]))
    );
    assert.deepEqual(
      nothing,
      find((n) => n === 3.5, list([1, 2, 3, 4, 5]))
    );
  });
}

describe("Foldable", () => {
  describe("derived foldable implementation", () => {
    @foldable
    class List<A> implements Foldable<A> {
      constructor(private arr: A[]) {};
      foldr<B>(f: (a: A, b: B) => B, acc: B): B {
        for (let i = this.arr.length - 1; 0 <= i; --i) {
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
    testFoldable(<A>(arr: A[]) => new List(arr));
    it("can't derive without `fold` method", () => {
      assert.throws(() => {
        @foldable
        class NotAFoldable<A> {
          constructor(private arr: A[]) {};
        }
      });
    });
  });
});

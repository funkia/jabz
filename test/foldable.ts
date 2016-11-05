import "mocha";
import {assert} from "chai";

import {
  Foldable, foldable, foldMap, fold, size
} from "../src/foldable";
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
  size: () => number;
}

describe("Foldable", () => {
  describe("derived foldable implementation", () => {
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
    it("has size", () => {
      assert.deepEqual((new List([1, 1, 1, 1])).size(), 4);
    });
  });
});

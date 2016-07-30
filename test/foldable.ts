///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {Foldable, AbstractFoldable} from "../src/foldable";
import {Monoid, MonoidConstructor} from "../src/monoid";
import {Sum} from "../src/monoids/sum";

class List<A> extends AbstractFoldable<A> {
  constructor(private arr: [A]) {
    super();
  };
  foldMapId<M extends Monoid<M>>(acc: M, f: (a: A) => M): M {
    for (let i = 0; i < this.arr.length; ++i) {
      acc = acc.merge(f(this.arr[i]));
    }
    return acc;
  }
}

describe("Foldable", () => {
  describe("simple list implementation", () => {
    it("has foldmap", () => {
      assert.deepEqual((new List([1, 2, 3, 4, 5])).foldMap(Sum), Sum(15));
    });
    it("has fold", () => {
      assert.deepEqual((new List([1, 2, 3, 4, 5])).fold(0, (n, m) => n + m), 15);
    });
    it("has size", () => {
      assert.deepEqual((new List([1, 1, 1, 1])).size(), 4);
    });
  });
});

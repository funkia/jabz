///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {Foldable, AbstractFoldable} from "../src/foldable";
import {Monoid, MonoidConstructor} from "../src/monoid";
import {Sum} from "../src/monoids/sum";

class List<A> extends AbstractFoldable<A> {
  constructor(private arr: [A]) {
    super();
  };
  foldMapId<M extends Monoid<M>>(id: M, f: (a: A) => M): M {
    let acc = id;
    for (let i = 0; i < this.arr.length; ++i) {
      acc = acc.merge(f(this.arr[i]));
    }
    return acc;
  }
}

describe("Foldable", () => {
  describe("simple list implementation", () => {
    assert.deepEqual((new List([1, 2, 3, 4, 5])).foldMap(Sum), Sum(15));
  });
  describe("simple list implementation", () => {
    assert.deepEqual((new List([1, 2, 3, 4, 5])).fold(0, (n, m) => n + m), 15);
  });
});

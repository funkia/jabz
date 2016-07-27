///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {Foldable} from "../src/foldable";
import {Monoid, MonoidConstructor} from "../src/monoid";
import {Sum} from "../src/monoids/sum";

describe("Foldable", () => {
  describe("simple list implementation", () => {
    class List<A> implements Foldable<A> {
      constructor(private arr: [A]) {};
      foldMap<B, M extends Monoid<M>>(f: MonoidConstructor<A, M>): M {
        let acc = f.identity;
        for (let i = 0; i < this.arr.length; ++i) {
          acc = acc.merge(f(this.arr[i]));
        }
        return acc;
      }
    }
    assert.deepEqual((new List([1, 2, 3, 4, 5])).foldMap(Sum), Sum(15));
  });
});

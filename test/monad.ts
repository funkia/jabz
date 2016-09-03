///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {mixin} from "../src/utils";
import {Applicative} from "../src/applicative";
import {Monad, AbstractMonad, deriveMonad, fgo} from "../src/monad";
import {Maybe, just, nothing} from "../src/maybe";

class List<A> implements Monad<A> {
  constructor(public arr: A[]) {};
  of<B>(b: B): List<B> {
    return new List([b]);
  };
  chain<B>(f: (a: A) => List<B>): List<B> {
    let newArr: B[] = [];
    for (let i = 0; i < this.arr.length; ++i) {
      const arr2 = f(this.arr[i]).arr;
      for (let j = 0; j < arr2.length; ++j) {
        newArr.push(arr2[j]);
      }
    }
    return new List(newArr);
  }
  flatten: <B>(m: Monad<Monad<B>>) => Monad<B>;
  map: <B>(f: (a: A) => B) => Monad<B>;
  mapTo: <B>(b: B) => Monad<B>;
  lift: (f: Function, ...ms: any[]) => Monad<any>;
}

deriveMonad(List);

describe("Monad", () => {
  it("has correct chain", () => {
    assert.deepEqual(
      new List([0, 1, 2, 3, 4, 5]),
      (new List([0, 3])).chain((x: number) => new List([x, x + 1, x + 2]))
    );
  });
  describe("mixin", () => {
    // test that the monad mixin implements all derived methods
    // correctly for a simple non-determinism monad
    it("map works", () => {
      assert.deepEqual(
        new List([1, 4, 9]),
        (new List([1, 2, 3]).map((x: number) => x * x))
      );
    });
    it("mapTo works", () => {
      assert.deepEqual(
        new List([4, 4, 4]),
        (new List([1, 2, 3]).map((x: number) => 4))
      );
    });
    it("flatten works", () => {
      const {flatten} = new List([1]);
      assert.deepEqual(
        new List([1, 2, 3, 4, 5, 6]),
        flatten(new List([new List([1, 2]), new List([3, 4, 5]), new List([6])]))
      );
    });
    it("lift works", () => {
      const {lift} = new List([1]);
      assert.deepEqual(
        new List([-2, -1, 0, -1, 0, 1]),
        lift((x: number, y: number, z: number) => x + y - z, new List([1, 2]), new List([3, 4, 5]), new List([6]))
      );
    });
  });
});

describe("fgo", () => {
  it("fgo works with Maybe", () => {
    const fgoMaybe: (x: number, y: number, z: number) => Maybe<number> = fgo(function*(x, y, z) {
      const a = yield just(x);
      const b = yield just(y);
      const c = yield just(z)
      return just(a + b + c);
    })
    assert.deepEqual(
      just(6),
      fgoMaybe(1, 2, 3)
    );
  });
});

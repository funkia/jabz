import "mocha";
import {assert} from "chai";

import {mixin} from "../src/utils";
import {Applicative} from "../src/applicative";
import {Monad, monad, arrayFlatten, go, fgo, flatten, foldrM} from "../src/monad";
import {Maybe, just, nothing} from "../src/maybe";
import {testFunctor} from "./functor";
import {testApplicative} from "./applicative";
import {fromArray} from "../src/conslist";

@monad
class List<A> implements Monad<A> {
  constructor(public arr: A[]) {};
  static multi = true;
  multi = true;
  static of<B>(b: B): List<B> {
    return new List([b]);
  };
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
  ap: <B>(a: Monad<(a: A) => B>) => Monad<B>;
  flatten: <B>() => Monad<B>;
  map: <B>(f: (a: A) => B) => Monad<B>;
  mapTo: <B>(b: B) => Monad<B>;
  lift: (f: Function, ...ms: any[]) => Monad<any>;
}

describe("Monad", () => {
  describe("deriving with `of` and `chain`", () => {
    testFunctor("List", new List([1, 2]));
    testApplicative(new List([1, 2]));
    it("has correct chain", () => {
      assert.deepEqual(
        new List([0, 1, 2, 3, 4, 5]),
        (new List([0, 3])).chain((x: number) => new List([x, x + 1, x + 2]))
      );
    });
    it("flatten works", () => {
      assert.deepEqual(
        new List([1, 2, 3, 4, 5, 6]),
        flatten(new List([new List([1, 2]), new List([3, 4, 5]), new List([6])]))
      );
    });
  });
  describe("deriving with `of` and `flatten`", () => {
    @monad
    class List<A> implements Monad<A> {
      constructor(public arr: A[]) {};
      static multi = true;
      multi = true;
      static of<B>(b: B): List<B> {
        return new List([b]);
      };
      of<B>(b: B): List<B> {
        return new List([b]);
      };
      chain: <B>(f: (a: A) => List<B>) => List<B>;
      ap: <B>(a: Monad<(a: A) => B>) => Monad<B>;
      flatten<B>(): List<B> {
        return new List(arrayFlatten(this.arr.map(l => (<List<B>><any>l).arr)));
      }
      map<B>(f: (a: A) => B): Monad<B> {
        return new List(this.arr.map(f));
      }
      mapTo: <B>(b: B) => Monad<B>;
      lift: (f: Function, ...ms: any[]) => Monad<any>;
    }
    testFunctor("List", new List([1, 2]));
    testApplicative(new List([1, 2]));
    it("has correct chain", () => {
      assert.deepEqual(
        new List([0, 1, 2, 3, 4, 5]),
        (new List([0, 3])).chain((x: number) => new List([x, x + 1, x + 2]))
      );
    });
    it("flatten works", () => {
      assert.deepEqual(
        new List([1, 2, 3, 4, 5, 6]),
        flatten(new List([new List([1, 2]), new List([3, 4, 5]), new List([6])]))
      );
    });
  });
  describe("foldlM", () => {
    it("works over traversable", () => {
      assert.deepEqual(
        foldrM((a, b) => b === a ? nothing : just(b + a), just(2), fromArray([4, 3])),
        just(9)
      );
      assert.deepEqual(
        foldrM((a, b) => (console.log(a, b), b === a ? nothing : just(b + a)), just(2), fromArray([5, 3])),
        nothing
      );
    });
    it("works over array", () => {
      assert.deepEqual(
        foldrM((a, b) => b === a ? nothing : just(b + a), just(2), [4, 3]),
        just(9)
      );
      assert.deepEqual(
        foldrM((a, b) => (console.log(a, b), b === a ? nothing : just(b + a)), just(2), [5, 3]),
        nothing
      );
    });
  });
  describe("go-notation", () => {
    it("go works with multi-monad", () => {
      const result = go(function*() {
        const n = yield new List([1, 2, 3]);
        const m = yield new List([10, 100]);
        return List.of(n * m);
      });
      assert.deepEqual(
        new List([10, 100, 20, 200, 30, 300]),
        result
      );
    });
  });
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

import "mocha";
import {assert} from "chai";

import {map, mapTo} from "../src/functor";
import {foldl, foldr, shortFoldl, size, maximum, minimum, sum, take} from "../src/foldable";
import {ap, lift} from "../src/applicative";
import {left, right} from "../src/either";
import {naturals, repeat} from "../src/infinitelist";

describe("InfiniteList", () => {
  describe("functor", () => {
    it("can map elements", () => {
      assert.deepEqual(
        take(5, map((n) => n * n, naturals)),
        [0, 1, 4, 9, 16]
      )
    });
    it("can mapto", () => {
      assert.deepEqual(
        take(5, mapTo(8, naturals)),
        [8, 8, 8, 8, 8]
      )
    });
  });
  describe("foldable", () => {
    it("cannot do strict folding", () => {
      assert.throws(() => naturals.foldr((a, b) => a + b, 0));
      assert.throws(() => naturals.foldl((a, b) => a + b, 0));
      assert.throws(() => naturals.shortFoldr((a, b) => right(a + b), 0));
    });
    it("has infinite size", () => {
      assert.strictEqual(size(naturals), Infinity);
    });
    it("maximum element is infinity", () => {
      assert.strictEqual(maximum(naturals), Infinity);
    });
    it("minimum element is zero", () => {
      assert.strictEqual(minimum(naturals), 0);
    });
    it("has inifinite sum", () => {
      assert.strictEqual(sum(naturals), Infinity);
    });
    it("has left fold", () => {
      assert.deepEqual(
        shortFoldl(
          (acc, n) => n > 5 ? left(acc) : right(acc - n), 0, naturals
        ),
        ((((0 - 1) - 2) - 3) - 4) - 5
      );
    });
    it("gives infinite list of constant element", () => {
      assert.deepEqual(take(5, repeat(1)), [1, 1, 1, 1, 1]);
    });
  });
  describe("applicative", () => {
    it("gives repeating list in of", () => {
      assert.deepEqual(
        take(5, naturals.of(5)),
        [5, 5, 5, 5, 5]
      )
    });
    it("ap", () => {
      assert.deepEqual(
        take(5, ap(naturals.map((n) => (m: number) => n * m), naturals)),
        [0, 1, 4, 9, 16]
      );
    });
    it("lifts function of two arguments", () => {
      assert.deepEqual(
        take(5, lift((a, b) => [a, b], naturals, repeat(0))),
        [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]
      );
    });
    it("lifts function of three arguments", () => {
      assert.deepEqual(
        take(5, lift((a, b, c) => a === b - c, naturals, repeat(0), naturals.map((n) => -n))),
        [true, true, true, true, true]
      );
    });
  });
});

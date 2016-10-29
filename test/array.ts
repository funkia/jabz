import "mocha";
import {assert} from "chai";

import Sum from "../src/monoids/sum";
import {Maybe, just, nothing} from "../src/maybe";
import {map, mapTo} from "../src/functor";
import {lift, of} from "../src/applicative";
import {size, fold, foldMap} from "../src/foldable";
import {traverse, sequence} from "../src/traversable";

describe("Native list", () => {
  describe("functor", () => {
    it("map", () => {
      assert.deepEqual(
        [1, 4, 9, 16],
        map((n) => n * n, [1, 2, 3, 4])
      );
    });
    it("mapTo", () => {
      assert.deepEqual(
        [7, 7, 7],
        mapTo(7, [1, 2, 3])
      );
    });
  });
  describe("applicative", () => {
    it("of", () => {
      assert.deepEqual(of(Array, 12), [12]);
      assert.deepEqual(of(Array, []), [[]]);
    });
    it("lift", () => {
      assert.deepEqual(
        [[1, 3, 8], [1, 3, 0], [1, 3, 7], [2, 3, 8], [2, 3, 0], [2, 3, 7]],
        lift((a, b, c) => [a, b, c], [1, 2], [3], [8, 0, 7])
      );
    });
  });
  describe("foldable", () => {
    it("foldMap", () => {
      assert.deepEqual(foldMap(Sum, [1, 2, 3, 4]), Sum.create(10));
    });
    it("fold", () => {
      assert.deepEqual(
        fold((n, ns) => ns.concat([n]), [], [1, 2, 3, 4]),
        [1, 2, 3, 4]
      );
    });
    it("size", () => {
      assert.strictEqual(size([1, 2, 3, 4]), 4);
    });
  });
  describe("traversable", () => {
    it("sequence", () => {
      assert.deepEqual(
        sequence(Maybe, [just(1), just(2), just(3)]),
        just([1, 2, 3])
      );
      assert.deepEqual(
        sequence(Maybe, [just(1), nothing(), just(3)]),
        nothing()
      );
    });
    it("traverse", () => {
      function safeParseInt(s: string): Maybe<number> {
        const n = parseInt(s, 10);
        return isNaN(n) === true ? nothing() : just(n);
      }
      assert.deepEqual(
        just([1, 2, 3]),
        traverse(Maybe, safeParseInt, ["1", "2", "3"])
      );
      assert.deepEqual(
        nothing(),
        traverse(Maybe, safeParseInt, ["1", "two", "3"])
      );
    });
  });
});

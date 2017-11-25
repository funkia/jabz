import "mocha";
import { assert } from "chai";

import Sum from "../src/monoids/sum";
import { Maybe, just, nothing } from "../src/maybe";
import { identity, combine } from "../src/monoid";
import { map, mapTo } from "../src/functor";
import { lift, of } from "../src/applicative";
import { chain, flatten, go } from "../src/monad";
import {
  size,
  foldr,
  foldl,
  foldMap,
  sequence_,
  isEmpty
} from "../src/foldable";
import { traverse, sequence } from "../src/traversable";
import { IO, call, runIO } from "../src/io";

describe("Native list", () => {
  describe("monoid", () => {
    it("has empty array as identity", () => {
      assert.deepEqual(identity(Array), []);
    });
    it("concatenates arrays", () => {
      assert.deepEqual(combine([1, 2, 3], [4, 5]), [1, 2, 3, 4, 5]);
    });
  });
  describe("functor", () => {
    it("map", () => {
      assert.deepEqual([1, 4, 9, 16], map(n => n * n, [1, 2, 3, 4]));
    });
    it("mapTo", () => {
      assert.deepEqual([7, 7, 7], mapTo(7, [1, 2, 3]));
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
  describe("monad", () => {
    it("flatten", () => {
      assert.deepEqual([1, 2, 3, 4, 5], flatten([[1, 2], [3], [4, 5]]));
    });
    it("chain", () => {
      assert.deepEqual(
        [2, 3, 5, 6, 10, 11],
        chain((n: number) => [n + 1, n + 2], [1, 4, 9])
      );
    });
  });
  describe("foldable", () => {
    it("foldMap", () => {
      assert.deepEqual(foldMap(Sum, [1, 2, 3, 4]), Sum.create(10));
    });
    it("foldr", () => {
      assert.deepEqual(foldr((n, ns) => ns.concat([n]), [], [1, 2, 3, 4]), [
        4,
        3,
        2,
        1
      ]);
    });
    it("size", () => {
      assert.strictEqual(size([1, 2, 3, 4]), 4);
    });
    it("folds in right direction", () => {
      assert.deepEqual(
        foldr((n, m) => n - m, 1, [12, 3, 4]),
        12 - (3 - (4 - 1))
      );
    });
    it("foldl", () => {
      assert.deepEqual(
        foldl((acc, n) => acc - n, 1, [16, 12, 9, 6, 3]),
        1 - 16 - 12 - 9 - 6 - 3
      );
    });
    it("isEmpty", () => {
      assert.strictEqual(isEmpty([1, 2, 3]), false);
      assert.strictEqual(isEmpty([]), true);
    });
    describe("sequence_", () => {
      it("sequences justs to just", () => {
        assert.deepEqual(
          sequence_(Maybe, [just(1), just(2), just(3)]),
          just(undefined)
        );
      });
      it("sequences nothing to nothing", () => {
        assert.deepEqual(
          sequence_(Maybe, [just(1), nothing, just(3)]),
          nothing
        );
      });
      it("sequences in right order", () => {
        let results: number[] = [];
        const l = [
          call(() => results.push(1)),
          call(() => results.push(2)),
          call(() => results.push(3))
        ];
        const action = sequence_(IO, l);
        return runIO(action).then(() => {
          assert.deepEqual(results, [1, 2, 3]);
        });
      });
    });
  });
  describe("traversable", () => {
    it("sequence", () => {
      assert.deepEqual(
        sequence(Maybe, [just(1), just(2), just(3)]),
        just([1, 2, 3])
      );
      assert.deepEqual(sequence(Maybe, [just(1), nothing, just(3)]), nothing);
    });
    it("traverse", () => {
      function safeParseInt(s: string): Maybe<number> {
        const n = parseInt(s, 10);
        return isNaN(n) === true ? nothing : just(n);
      }
      assert.deepEqual(
        just([1, 2, 3]),
        traverse(Maybe, safeParseInt, ["1", "2", "3"])
      );
      assert.deepEqual(
        nothing,
        traverse(Maybe, safeParseInt, ["1", "two", "3"])
      );
    });
  });
});

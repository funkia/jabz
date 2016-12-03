import "mocha";
import {assert} from "chai";

import {foldl, foldr, shortFoldl, size, maximum, minimum, sum, take} from "../src/foldable";
import {left, right} from "../src/either";
import {naturals, repeat} from "../src/infinitelist";

describe("InfiniteList", () => {
  describe("naturals", () => {
    it("cannot fold from the right", () => {
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
  });
  describe("repeat", () => {
    it("gives infinite list of constant element", () => {
      assert.deepEqual(take(5, repeat(1)), [1, 1, 1, 1, 1]);
    });
  });
});

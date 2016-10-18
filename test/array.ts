import "mocha";
import {assert} from "chai";

import Sum from "../src/monoids/sum";
import {size, fold, foldMap} from "../src/foldable";

describe("Native list", () => {
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
});

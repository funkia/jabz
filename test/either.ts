import "mocha";
import { assert } from "chai";

import { Either, left, right, isLeft, isRight } from "../src/either";
import { map } from "../src/functor";
import { testFunctor } from "./functor";
import { lift } from "../src/applicative";

describe("Either", () => {
  describe("Functor", () => {
    it("maps over right", () => {
      assert.deepEqual(right(16), map((x: number) => x * x, right(4)));
    });
    it("does not affect left", () => {
      assert.deepEqual(left(4), map((x: number) => x * x, left(4)));
    });
    it("is still Either after map", () => {
      // the following should typecheck
      map((x: number) => x * x, right(4)).match({
        left: (): {} => ({}),
        right: (): {} => ({})
      });
    });
    it("can check for left or right", () => {
      assert.strictEqual(true, isLeft(left(3)));
      assert.strictEqual(true, isRight(right(3)));
      assert.strictEqual(false, isLeft(right(3)));
      assert.strictEqual(false, isRight(left(3)));
    });
  });
  describe("Applicative", () => {
    it("creates right in `of`", () => {
      assert.deepEqual(right(12), Either.of(12));
      assert.deepEqual(right(12), right(2).of(12));
      assert.deepEqual(right(12), left(2).of(12));
    });
    describe("ap", () => {
      it("applies function on two rights", () => {
        assert.deepEqual(right(12).ap(right((n: number) => n * n)), right(144));
      });
      it("when both left it returns first", () => {
        assert.deepEqual(left("not his one").ap(left("fail")), left("fail"));
      });
      it("when last left it returns last left", () => {
        assert.deepEqual(
          left("fail").ap(right((n: number) => n * n)),
          left("fail")
        );
      });
    });
    it("applies function to rights", () => {
      assert.deepEqual(
        right(11),
        lift((x, y, z) => x * y - z, right(4), right(3), right(1))
      );
    });
    it("bails on left", () => {
      assert.deepEqual(
        left(0),
        lift((x, y, z) => x * y - z, right(4), left(0), right(1))
      );
    });
  });
});

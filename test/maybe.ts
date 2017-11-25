import "mocha";
import { assert } from "chai";

import Sum from "../src/monoids/sum";
import {
  Maybe,
  just,
  nothing,
  isNothing,
  isJust,
  fromMaybe,
  maybe
} from "../src/maybe";
import { map, mapTo } from "../src/functor";
import { go, flatten } from "../src/monad";
import { size, foldr, foldMap } from "../src/foldable";
import { Either, right, left } from "../src/either";
import { of } from "../src/applicative";
import { testFunctor } from "./functor";

describe("Maybe", () => {
  it("isJust and isNothing", () => {
    assert.strictEqual(isJust(nothing), false);
    assert.strictEqual(isJust(just(1)), true);
    assert.strictEqual(isNothing(nothing), true);
    assert.strictEqual(isNothing(just(1)), false);
  });
  it("can check wether something is a maybe", () => {
    assert.isTrue(Maybe.is(nothing));
    assert.isTrue(Maybe.is(just(2)));
    assert.isFalse(Maybe.is(2));
    assert.isFalse(Maybe.is(undefined));
    assert.isFalse(Maybe.is({ foo: "bar" }));
  });
  it("fromMaybe", () => {
    assert.strictEqual(fromMaybe(5, nothing), 5);
    assert.strictEqual(fromMaybe(5, just(3)), 3);
  });
  it("maybe", () => {
    const double = (n: number) => 2 * n;
    assert.strictEqual(maybe(5, double, nothing), 5);
    assert.strictEqual(maybe(5, double, just(3)), 6);
  });
  it("gives just on `of`", () => {
    const j = just(12);
    assert.deepEqual(j, j.of(12));
  });
  it("gives nothing when bound to nothing", () => {
    const j = just(12);
    const n: Maybe<number> = nothing;
    assert.deepEqual(j.chain(_ => nothing), n);
    assert.deepEqual(n.chain<number>(_ => just(12)), n);
  });
  it("passes values through", () => {
    const res: Maybe<number> = go(function*() {
      const a = yield just(1);
      const b = yield just(3);
      const c = yield just(2);
      return a + b + c;
    });
    assert.deepEqual(res, just(6));
  });
  it("bails on nothing", () => {
    const res = go(function*() {
      const a = yield just(1);
      const b = yield nothing;
      const c = yield just(2);
      return just(a + b + c);
    });
    assert.deepEqual(res, nothing);
  });
  it("is joined correctly", () => {
    assert.deepEqual(nothing, flatten(nothing));
    assert.deepEqual(just(12), flatten(just(just(12))));
  });
  testFunctor("Maybe", nothing);
  testFunctor("Maybe", just(12));
  it("is still a maybe after map", () => {
    // this should not throw a type error
    map<number, number>(x => x + 2, just(1)).chain(x => nothing);
  });
  it("is still nothing after map on nothing", () => {
    assert.strictEqual(isNothing(nothing.map(x => x * x)), true);
  });
  it("works with mapTo", () => {
    assert.deepEqual(just(1), mapTo(1, just(2)));
  });
  describe("applicative", () => {
    const { lift } = nothing;
    it("of", () => {
      assert.deepEqual(of(Maybe, 12), just(12));
    });
    describe("ap", () => {
      function add2(n: number) {
        return n + 2;
      }
      it("gives nothing", () => {
        assert.deepEqual(nothing.ap(just(add2)), nothing);
      });
      it("gives just of result", () => {
        assert.deepEqual(just(3).ap(just(add2)), just(5));
      });
    });
    it("lifts function of one argument", () => {
      assert.deepEqual(just(8), lift((x: number) => x * 2, just(4)));
      assert.deepEqual(nothing, lift((x: number) => x * 2, nothing));
    });
    it("lifts function of two arguments", () => {
      assert.deepEqual(
        just(13),
        lift((x: number, y: number) => x * 2 + y, just(4), just(5))
      );
      assert.deepEqual(
        nothing,
        lift((x: number, y: number) => x * 2 + y, just(4), nothing)
      );
    });
    it("lifts function of three arguments", () => {
      assert.deepEqual(
        just(10),
        lift(
          (x: number, y: number, z: number) => x + y + z,
          just(4),
          just(5),
          just(1)
        )
      );
      assert.deepEqual(
        nothing,
        lift(
          (x: number, y: number, z: number) => x + y + z,
          nothing,
          just(5),
          just(1)
        )
      );
    });
  });
  describe("foldable", () => {
    it("has size", () => {
      assert.strictEqual(size(just("hello")), 1);
      assert.strictEqual(size(nothing), 0);
    });
    it("can be folded", () => {
      assert.strictEqual(5, foldr((n, m) => n + m, 5, nothing));
      assert.strictEqual(8, foldr((n, m) => n + m, 5, just(3)));
    });
    it("has `foldMap`", () => {
      assert.deepEqual(new Sum(0), foldMap(Sum, nothing));
      assert.deepEqual(new Sum(3), foldMap(Sum, just(3)));
    });
  });
  describe("traversable", () => {
    describe("traverse", () => {
      it("gives empty in applicative", () => {
        assert.deepEqual(
          nothing.traverse(Either, n => right(n * 2)),
          right(nothing)
        );
      });
      it("gives just from just", () => {
        assert.deepEqual(
          just(12).traverse(Either, n => right(n * 2)),
          right(just(24))
        );
      });
    });
    describe("sequence", () => {
      const sequence = nothing.sequence;
      it("gives applicative of nothing when nothing", () => {
        assert.deepEqual(sequence(Either, nothing), right(nothing));
      });
      it("returns applicative of just when just", () => {
        assert.deepEqual(sequence(Either, just(right(12))), right(just(12)));
        assert.deepEqual(sequence(Either, just(left(12))), left(12));
      });
    });
  });
});

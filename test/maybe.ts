import "mocha";
import {assert} from "chai";

import Sum from "../src/monoids/sum";
import {Maybe, just, nothing} from "../src/maybe";
import {map, mapTo} from "../src/functor";
import {go, flatten} from "../src/monad";
import {size, fold, foldMap} from "../src/foldable";
import {Either, right, left} from "../src/either";
import {of} from "../src/applicative";
import {testFunctor} from "./functor";

describe("Maybe", () => {
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
      return just(a + b + c);
    }, Maybe);
    assert.deepEqual(res, just(6));
  });
  it("bails on nothing", () => {
    const res = go(function*() {
      const a = yield just(1);
      const b = yield nothing;
      const c = yield just(2);
      return just(a + b + c);
    }, Maybe);
    assert.deepEqual(res, nothing);
  });
  it("is joined correctly", () => {
    assert.deepEqual(nothing, flatten<number>(nothing));
    assert.deepEqual(just(12), flatten<number>(just(just(12))));
  });
  testFunctor("Maybe", nothing);
  testFunctor("Maybe", just(12));
  it("is still a maybe after map", () => {
    // this should not throw a type error
    map<number, number>(x => x + 2, just(1)).chain(x => nothing);
  });
  it("works with mapTo", () => {
    assert.deepEqual(just(1), mapTo(1, just(2)));
  });
  describe("applicative", () => {
    const {lift} = nothing;
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
      assert.deepEqual(
        just(8),
        lift((x: number) => x * 2, just(4))
      );
      assert.deepEqual(
        nothing,
        lift((x: number) => x * 2, nothing)
      );
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
        lift((x: number, y: number, z: number) => x + y + z, just(4), just(5), just(1))
      );
      assert.deepEqual(
        nothing,
        lift((x: number, y: number, z: number) => x + y + z, nothing, just(5), just(1))
      );
    });
  });
  describe("foldable", () => {
    it("has size", () => {
      assert.strictEqual(size(just("hello")), 1);
      assert.strictEqual(size(nothing), 0);
    });
    it("can be folded", () => {
      assert.strictEqual(5, fold((n, m) => n + m, 5, nothing));
      assert.strictEqual(8, fold((n, m) => n + m, 5, just(3)));
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
          just(12).traverse(Either, (n => right(n * 2))),
          right(just(24))
        );
      });
    });
    describe("sequence", () => {
      const sequence = nothing.sequence;
      it("gives applicative of nothing when nothing", () => {
        assert.deepEqual(
          sequence(Either, nothing),
          right(nothing)
        )
      });
      it("returns applicative of just when just", () => {
        assert.deepEqual(
          sequence(Either, just(right(12))),
          right(just(12))
        );
        assert.deepEqual(
          sequence(Either, just(left(12))),
          left(12)
        );
      });
    });
  });
});

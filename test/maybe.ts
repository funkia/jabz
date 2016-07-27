 ///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {Maybe, Just, Nothing} from "../src/maybe";
import {Do, join} from "../src/monad";
import {map, mapTo} from "../src/functor";
import testFunctor from "./functor";

describe("Maybe", () => {
  it("gives just on `of`", () => {
    const j = Just(12);
    assert.deepEqual(j, j.of(12));
  });
  it("gives nothing when bound to nothing", () => {
    const j = Just(12);
    const n: Maybe<number> = Nothing();
    assert.deepEqual(j.chain(_ => Nothing()), n);
    assert.deepEqual(n.chain<number>(_ => Just(12)), n);
  });
  it("passes values through", () => {
    const res = Do(function*() {
      const a = yield Just(1);
      const b = yield Just(3);
      const c = yield Just(2);
      return Just(a + b + c);
    });
    assert.deepEqual(res, Just(6));
  });
  it("bails on nothing", () => {
    const res = Do(function*() {
      const a = yield Just(1);
      const b = yield Nothing();
      const c = yield Just(2);
      return Just(a + b + c);
    });
    assert.deepEqual(res, Nothing());
  });
  it("is joined correctly", () => {
    assert.deepEqual(join(Just(Just(12))), Just(12));
  });
  testFunctor("Maybe", Just(12));
  it("is still a maybe after map", () => {
    // this should not throw a type error
    map<number, number>(x => x + 2, Just(1)).chain(x => Nothing());
  });
  it("works with mapTo", () => {
    assert.deepEqual(Just(1), mapTo(1, Just(2)));
  });
  it("lifts function of one argument", () => {
    const {lift} = Nothing();
    assert.deepEqual(
      Just(8),
      lift((x: number) => x * 2, Just(4))
    );
  });
  it("lifts function of two arguments", () => {
    const {lift} = Nothing();
    assert.deepEqual(
      Just(13),
      lift((x: number, y: number) => x * 2 + y, Just(4), Just(5))
    );
  });
  it("lifts function of three arguments", () => {
    const {lift} = Nothing();
    assert.deepEqual(
      Just(10),
      lift((x: number, y: number, z: number) => x + y + z, Just(4), Just(5), Just(1))
    );
  });
});

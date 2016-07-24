 ///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {Maybe, Just, Nothing} from "../src/maybe";
import {Do} from "../src/monad";
import testFunctor from "./functor";

describe("maybe", () => {
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
  testFunctor("Maybe", Just(12));
});

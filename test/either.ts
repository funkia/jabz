 ///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {Either, left, right} from "../src/either";
import {Do, join} from "../src/monad";
import {map, mapTo} from "../src/functor";
import testFunctor from "./functor";  

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
        left: () => ({}),
        right: () => ({})
      });
    });
  });
});

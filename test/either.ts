 ///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {Either, left, right} from "../src/either";
import {Do, join} from "../src/monad";
import {map, mapTo} from "../src/functor";
import testFunctor from "./functor";  

describe("Either", () => {
  describe("Functor", () => {
    it("maps over right", () => {
      assert.deepEqual(right(16), map((x) => x * x, right(4)));
    });
  });
  describe("Monad", () => {
    
  });
});

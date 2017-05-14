import "mocha";
import {assert} from "chai";

import {Either} from "../src/either";
import {Monad, monad} from "../src/monad";
import {Applicative, ApplicativeDictionary, lift} from "../src/applicative";
import {Traversable, traversable} from "../src/traversable";

import {testMonoid} from "./monoid";
import {testFoldable} from "./foldable";
import {testTraversable} from "./traversable";
import {testFunctor} from "./functor";
import {testApplicative} from "./applicative";

import {Cons, nil, cons, fromArray} from "../src/conslist";

describe("cons list", () => {
  it("can be created from array", () => {
    assert.deepEqual(fromArray([1, 2, 3, 4]),
                     cons(1, cons(2, cons(3, cons(4, nil)))));
  });
  it("can be concatenated", () => {
    assert.deepEqual(
      fromArray([1, 2, 3]).combine(fromArray([4, 5])),
      fromArray([1, 2, 3, 4, 5])
    );
  });
  it("can flatten", () => {
    assert.deepEqual(
      fromArray([fromArray([1, 2]), fromArray([3]), fromArray([4, 5])]).flatten(),
      fromArray([1, 2, 3, 4, 5])
    );
  });
  testMonoid("Cons", cons(1, nil));
  testFunctor("Cons", cons(1, nil))
  testApplicative(cons(1, nil));
  testFoldable(fromArray);
  testTraversable(fromArray);
});


import "mocha";
import { assert } from "chai";

import Sum from "../src/monoids/sum";
import { combine } from "../src/monoid";
import { testMonoid } from "./monoid";

describe("sum", () => {
  it("has identity", () => {
    assert.deepEqual(Sum.create(3), combine(Sum.create(3), Sum.identity()));
    assert.deepEqual(Sum.create(3), combine(Sum.identity(), Sum.create(3)));
  });
  testMonoid<Sum>("Sum", new Sum(4));
});

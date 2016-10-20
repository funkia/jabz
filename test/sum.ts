import "mocha";
import {assert} from "chai";

import Sum from "../src/monoids/sum";
import {merge} from "../src/monoid";
import monoidTest from "./monoid";

describe("sum", () => {
  it("has identity", () => {
    assert.deepEqual(
      Sum.create(3),
      merge(Sum.create(3), Sum.identity())
    );
    assert.deepEqual(
      Sum.create(3),
      merge(Sum.identity(), Sum.create(3))
    );
  });
  monoidTest<Sum>("Sum", new Sum(4));
});

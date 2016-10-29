import "mocha";
import {assert} from "chai";

import {Monoid, combine, identity} from "../src/monoid";
import Sum from "../src/monoids/sum";

describe("monoid", () => {
  it("can combine and id", () => {
    combine(Sum.create(12), Sum.create(1)).identity();
  });
});

export default function<M extends Monoid<M>>(name: string, monoid: M): void {
  describe("monoid " + name, () => {
    it("has identity element", () => {
      assert.deepEqual(monoid.identity().combine(monoid),
                       monoid.combine(monoid.identity()));
      assert.deepEqual(identity(monoid).combine(monoid),
                       monoid.combine(monoid.identity()));
    });
  });
};

describe("string monoid", () => {
  it("has empty string as identity", () => {
    assert.deepEqual(identity(String), "");
  });
  it("concatenates strings", () => {
    assert.deepEqual(combine("hello ", "world"), "hello world");
  });
});

import "mocha";
import {assert} from "chai";

import {Monoid, merge, identity} from "../src/monoid";
import Sum from "../src/monoids/sum";

describe("monoid", () => {
  it("can merge and id", () => {
    merge(Sum.create(12), Sum.create(1)).identity();
  });
});

export default function<M extends Monoid<M>>(name: string, monoid: M): void {
  describe("monoid " + name, () => {
    it("has identity element", () => {
      assert.deepEqual(monoid.identity().merge(monoid),
                       monoid.merge(monoid.identity()));
    });
  });
  describe("string monoid", () => {
    it("has empty string as identity", () => {
      assert.deepEqual(identity(String), "");
    });
    it("concatenates strings", () => {
      assert.deepEqual(merge("hello ", "world"), "hello world");
    });
  });
};

///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {Monoid, merge} from "../src/monoid";
import {Sum} from "../src/monoids/sum";

describe("monoid", () => {
  it("can merge and id", () => {
    merge(Sum(12), Sum(1)).identity();
  });
});

export default function<M extends Monoid<M>>(name: string, monoid: M): void {
  describe("monoid " + name, () => {
    it("has identity element", () => {
      assert.deepEqual(monoid.identity().merge(monoid),
                       monoid.merge(monoid.identity()));
    });
  });
};

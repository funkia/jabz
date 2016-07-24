///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {Monoid} from "../src/monoid";

export default function<A>(name: string, monoid: Monoid<A>) {
  describe("monoid " + name, () => {
    it("has identity element", () => {
      assert.deepEqual(monoid.identity.merge(monoid),
                       monoid.merge(monoid.identity));
    });
  });
};

 ///<reference path="../../typings/index.d.ts" />
import assert = require("assert");

import {Sum, sumId} from "../../src/monoids/sum";
import {merge} from "../../src/monoid";

describe("sum", () => {
  it("has identity", () => {
    assert.deepEqual(
      Sum(3),
      merge(Sum(3), sumId)
    );
    assert.deepEqual(
      Sum(3),
      merge(sumId, Sum(3))
    );
  });
});

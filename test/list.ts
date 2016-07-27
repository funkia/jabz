///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {List, fromArray} from "../src/list";
import {Sum, toNumber} from "../src/monoids/sum";

describe("List", () => {
  it("implements foldMap", () => {
    assert.deepEqual(Sum(10),
                     fromArray([1, 2, 3, 4]).foldMap(Sum));
  });
});

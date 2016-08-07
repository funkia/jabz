///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {Do} from "../src/monad";

import {List, fromArray} from "../src/list";
import {Sum, toNumber} from "../src/monoids/sum";

// describe("List", () => {
//   describe("Foldable", () => {
//     it("implements foldMap", () => {
//       assert.deepEqual(Sum(10),
//                        fromArray([1, 2, 3, 4]).foldMap(Sum));
//     });
//   });
//   describe("Monad", () => {
//     it("works with do-notation", () => {
//       const list: List<number> = Do(function*() {
//         const a = yield fromArray([0, 3, 6]);
//         const b = yield fromArray([a, a + 1, a + 2])
//         return fromArray([b, b*b]);
//       });
//     });
//   });
// });

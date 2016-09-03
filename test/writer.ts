///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {createWriter, runWriter} from "../src/writer";

import {Sum} from "../src/monoids/sum";

import {go, join} from "../src/monad";
import {map, mapTo} from "../src/functor";

describe("Writer", () => {
  describe("Sum", () => {
    const SumWriter = createWriter(Sum);
    const {tell, listen, of} = SumWriter;
    it("works with Sum monoid", () => {
      const writer = go(function*() {
        yield tell(Sum(3));
        yield tell(Sum(2));
        const [_, cur] = yield listen(tell(Sum(7)));
        assert.deepStrictEqual(cur, Sum(7));
        const next = yield of(Sum(3));
        yield tell(next);
        return of("Hello");
      });
      assert.deepEqual(
        runWriter(writer),
        [Sum(15), "Hello"]
      );
    });
    it("gives identity", () => {
      assert.deepEqual(
        runWriter(of("Hello Writer!")),
        [Sum(0), "Hello Writer!"]
      );
    });
  });
  // it("works with strings", () => {
  //   const StringWriter =
  //   const written = go(function*() {
  //     yield tell("First");
  //     yield tell("-glance");
  //     const [_, cur] = yield listen(tell(" feeling of "));
  //     assert.strictEqual(cur, " feeling of ");
  //     const next = yield of("New York time");
  //     yield tell(next);
  //     return of(22);
  //   });
  //   assert.deepEqual(
  //     runWriter(written),
  //     ["First-glance feeling of New York time", 22]
  //   );
  // });
});

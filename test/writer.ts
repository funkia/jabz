import "mocha";
import {assert} from "chai";

import {createWriter, runWriter} from "../src/writer";

import Sum from "../src/monoids/sum";

import {go} from "../src/monad";
import {map, mapTo} from "../src/functor";

describe("Writer", () => {
  describe("Sum", () => {
    const SumWriter = createWriter(Sum);
    const {tell, listen, of} = SumWriter;
    it("works with Sum monoid", () => {
      const writer = go(function*() {
        yield tell(Sum.create(3));
        yield tell(Sum.create(2));
        const [_, cur] = yield listen(tell(Sum.create(7)));
        assert.deepEqual(cur, Sum.create(7));
        const next = yield of(Sum.create(3));
        yield tell(next);
        return "Hello";
      });
      assert.deepEqual(
        runWriter(writer),
        [Sum.create(15), "Hello"]
      );
    });
    it("gives identity", () => {
      assert.deepEqual(
        runWriter(of("Hello Writer!")),
        [Sum.create(0), "Hello Writer!"]
      );
    });
    it("gives identity on instance", () => {
      assert.deepEqual(
        runWriter(of("Foo").of("Bar")),
        [Sum.create(0), "Bar"]
      );
    });
  });
  it("works with strings", () => {
    const StringWriter = createWriter(String);
    const {tell, listen, of} = StringWriter;
    const written = go(function*() {
      yield tell("First");
      yield tell("-glance");
      const [_, cur] = yield listen(tell(" feeling of "));
      assert.strictEqual(cur, " feeling of ");
      const next = yield of("New York time");
      yield tell(next);
      return 22;
    });
    assert.deepEqual(
      runWriter(written),
      ["First-glance feeling of New York time", 22]
    );
  });
});

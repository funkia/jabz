 ///<reference path="../typings/index.d.ts" />
import assert = require("assert");

import {runWriter, tell, listen, of} from "../src/writer";

import {Do, join} from "../src/monad";
import {map, mapTo} from "../src/functor";

describe("String writer", () => {
  it("seems to work", () => {
    const written = Do(function*() {
      yield tell("First");
      yield tell("-glance");
      const [_, cur] = yield listen(tell(" feeling of "));
      assert.strictEqual(cur, " feeling of ");
      const next = yield of("New York time");
      yield tell(next);
      return of(22);
    });
    assert.deepEqual(
      runWriter(written),
      ["First-glance feeling of New York time", 22]
    );
  });
});

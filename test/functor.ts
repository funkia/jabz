import { assert } from "chai";

import { Functor, functor, mapMap } from "../src/functor";
import { just } from "../src/maybe";

function id<A>(a: A) {
  return a;
}

export function testFunctor<A>(name: string, functor: Functor<number>) {
  describe(name + "'s functor instance", () => {
    it("satisfies identity", () => {
      assert.deepEqual(functor.map(id), functor);
    });
    it("satisfies composition", () => {
      const f = (n: number) => n * n;
      const g = (n: number) => n - 4;
      assert.deepEqual(functor.map(f).map(g), functor.map(n => g(f(n))));
    });
    it("has `mapTo`", () => {
      assert.deepEqual(functor.mapTo(9), functor.map(_ => 9));
    });
  });
}

describe("deriving", () => {
  it("derives `mapTo`", () => {
    @functor
    class Container<A> {
      constructor(private val: A) {}
      map<B>(f: (a: A) => B): Container<B> {
        return new Container(f(this.val));
      }
      mapTo: <B>(b: B) => Container<B>;
    }
    testFunctor("Container", new Container(12));
  });
  it("throws if `map` is missing", () => {
    assert.throws(() => {
      @functor
      class NotAFunctor {
        constructor() {}
      }
    });
  });
  describe("mapMap", () => {
    it("maps function over just of just", () => {
      assert.deepEqual(mapMap(n => n * n, just(just(3))), just(just(9)));
    });
    it("works on array", () => {
      assert.deepEqual(mapMap(n => n * n, [[1, 2, 3], [4, 5], [6, 7]]), [
        [1, 4, 9],
        [16, 25],
        [36, 49]
      ]);
    });
    it("supports mix", () => {
      assert.deepEqual(mapMap(n => n * n, just([1, 2, 3])), just([1, 4, 9]));
    });
  });
});

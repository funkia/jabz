import {assert} from "chai";

import {Functor, functor} from "../src/functor";

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
      assert.deepEqual(functor.mapTo(9), functor.map((_) => 9));
    });
  });
};

describe("deriving", () => {
  it("derives `mapTo`", () => {
    @functor
    class Container<A> {
      constructor(private val: A) {};
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
        constructor() {};
      }
    });
  });
});

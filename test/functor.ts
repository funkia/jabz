import {assert} from "chai";

import {Functor} from "../src/functor";

function id<A>(a: A) {
  return a;
}

export default function<A>(name: string, functor: Functor<number>) {
  describe(name + "'s functor instance", () => {
    it("satisfies identity", () => {
      assert.deepEqual(functor.map(id), functor);
    });
    it("satisfies composition", () => {
      const f = (n: number) => n * n;
      const g = (n: number) => n - 4;
      assert.deepEqual(functor.map(f).map(g),
                       functor.map(n => g(f(n))));
    });
  });
};

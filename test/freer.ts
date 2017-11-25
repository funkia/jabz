import "mocha";
import { assert } from "chai";

import { functor } from "../src/functor";
import { Freer, Pure, Bind, liftF } from "../src/freer";
import { go } from "../src/monad";

describe("Freer", () => {
  describe("implementing State", () => {
    class State<S, A> {
      constructor(public state: (s: S) => [A, S]) {}
    }
    const get: State<any, any> = new State(s => [s, s]);
    const put = <S>(s: S) => new State(_ => [undefined, s]);

    const getF = liftF(get);
    const putF = <S>(s: S) => liftF(put(s));

    function runFState<S, A>(t: Freer<State<any, any>, A>, s: S): [A, S] {
      return t.match<[A, S]>({
        pure: a => [a, s],
        bind: (m, q) => {
          const [x, s2] = m.state(s);
          return runFState(q(x), s2);
        }
      });
    }

    it("works", () => {
      const testState: Freer<State<number, number>, number> = go(function*() {
        yield putF(10);
        const x = yield getF;
        return x;
      });
      assert.deepEqual(runFState(testState, 0), [10, 10]);
    });
  });
});

import { assert } from "chai";

import { testFunctor } from "./functor";
import { testApplicative } from "./applicative";
import {
  IO,
  runIO,
  testIO,
  withEffects,
  withEffectsP,
  call,
  callP,
  catchE,
  throwE
} from "../src/io";
import { ap, lift } from "../src/applicative";
import { go, Monad } from "../src/monad";
import { right, left } from "../src/either";
import { add } from "../src/utils";

describe("IO", () => {
  // testFunctor("IO", IO.of(12));
  // testApplicative(IO.of(12));
  it("gives pure computaion", () => {
    return runIO(IO.of(12)).then(res => {
      assert.equal(12, res);
    });
  });
  it("maps pure computation", () => {
    return runIO(IO.of(12).map(n => n * n)).then(res => {
      assert.equal(144, res);
    });
  });
  it("chains computations", () => {
    return runIO(IO.of(3).chain(n => IO.of(n + 4))).then(res => {
      assert.equal(7, res);
    });
  });
  it("works with do-notation", () => {
    const f1 = withEffects((a: number) => a * 2);
    const f2 = withEffects((a: number, b: number) => a + b);
    const comp: IO<number> = go(function*() {
      const a = yield IO.of(4);
      const b = yield f1(3);
      const sum = yield f2(a, b);
      return sum;
    });
    return runIO(comp).then(res => {
      assert.equal(10, res);
    });
  });
  it("applies function in effects to value in other effects", () => {
    const f1 = IO.of((a: number) => a * 2);
    const f2 = IO.of(3);
    const applied = ap(f1, f2);
    return runIO(applied).then(res => assert.equal(res, 6));
  });
  describe("wrapping", () => {
    it("wraps imperative function", () => {
      let variable = 0;
      function imperative(a: number, b: number): number {
        variable = variable + a + b;
        return variable;
      }
      const wrapped = withEffects(imperative);
      const comp = go(function*() {
        const a = yield wrapped(1, 2);
        assert.strictEqual(variable, 3);
        const b = yield wrapped(3, 4);
        assert.strictEqual(variable, 10);
        return a + b;
      });
      return runIO(comp).then(res => {
        assert.strictEqual(res, 13);
      });
    });
    it("wraps imperative function returning promise", () => {
      let variable = 0;
      function imperativeP(a: number, b: number): Promise<number> {
        variable = variable + a + b;
        return Promise.resolve(variable);
      }
      const wrapped = withEffectsP(imperativeP);
      const comp = go(function*() {
        const a = yield wrapped(1, 2);
        assert.strictEqual(a, 3);
        assert.strictEqual(variable, 3);
        const b = yield wrapped(3, 4);
        assert.strictEqual(b, 10);
        assert.strictEqual(variable, 10);
        return add(a, b);
      });
      return runIO(comp).then(res => {
        assert.deepEqual(res, 13);
      });
    });
  });
  describe("error handling", () => {
    const errorMessage = "I do not accept zero";
    it("can catch error from rejected promise", () => {
      function imperativeP(a: number): Promise<number> {
        return a === 0 ? Promise.reject(errorMessage) : Promise.resolve(a);
      }
      const wrapped = withEffectsP(imperativeP);
      const comp = catchE((err: string) => IO.of(err.length), wrapped(0));
      return runIO(comp)
        .then(res => {
          assert.deepEqual(res, errorMessage.length);
          return runIO(wrapped(0));
        })
        .catch(res => {
          assert.deepEqual(res, errorMessage);
        });
    });
    it("`catchE` function is not called when no error", () => {
      return runIO(
        catchE((_: any) => {
          throw new Error("No");
        }, IO.of(12))
      ).then(res => {
        assert.strictEqual(res, 12);
      });
    });
    it("can throw error with `throwE`", () => {
      const comp = catchE(
        (err: string) => IO.of(err.length),
        go(function*() {
          const a = yield IO.of(13);
          assert.deepEqual(a, 13);
          const b = yield throwE(errorMessage);
          return "Oh no, error thrown above >.<";
        })
      );
      return runIO(comp).then(res => {
        assert.deepEqual(res, errorMessage.length);
      });
    });
  });
  describe("calling", () => {
    it("calls function", () => {
      let variable = 0;
      function imperative(a: number, b: number, c: number, d: number): number {
        variable = a + b + c + d;
        return variable;
      }
      return runIO(call(imperative, 1, 2, 3, 4)).then(res => {
        assert.strictEqual(variable, 10);
        assert.strictEqual(res, 10);
      });
    });
    it("calls promise returning function", () => {
      let variable = 0;
      function imperative(a: number, b: number): Promise<number> {
        variable = a + b;
        return Promise.resolve(variable);
      }
      return runIO(callP(imperative, 1, 2)).then(res => {
        assert.deepEqual(variable, 3);
        assert.deepEqual(res, 3);
      });
    });
    it("calls promise returning function that rejects", () => {
      let variable = 0;
      function imperative(a: number, b: number): Promise<number> {
        variable = a + b;
        return Promise.reject(variable);
      }
      return runIO(callP(imperative, 1, 2)).catch(res => {
        assert.deepEqual(variable, 3);
        assert.deepEqual(res, 3);
      });
    });
  });
  describe("testing", () => {
    let n = 0;
    function add(m: number) {
      return (n += m);
    }
    function addTwice(m: number) {
      return (n += 2 * m);
    }
    const wrapped1 = withEffects(add);
    const wrapped2 = withEffects(addTwice);
    const comp = wrapped1(2).chain(n => wrapped2(3));
    it("can test", () => {
      testIO(comp, [[wrapped1(2), 2], [wrapped2(3), 8]], 8);
      assert.deepEqual(n, 0);
    });
    it("throws on incorrect function", () => {
      assert.throws(() => {
        testIO(comp, [[call(wrapped2, 2), 2], [call(wrapped2, 3), 8]], 8);
      });
    });
    it("handles computation ending with `of`", () => {
      const comp = wrapped1(3).chain(n => IO.of(4));
      testIO(comp, [[wrapped1(3), 3]], 4);
      assert.throws(() => {
        testIO(comp, [[wrapped1(3), 3]], 5);
      });
    });
    it("handles computation with map and chain", () => {
      const comp = wrapped1(4)
        .map(n => n * n)
        .chain(n => wrapped2(n + 2));
      testIO(comp, [[wrapped1(4), 4], [wrapped2(18), 18 * 2 + 4]], 18 * 2 + 4);
    });
  });
});

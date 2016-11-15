import {assert} from "chai";

import {testFunctor} from "./functor";
import {testApplicative} from "./applicative";
import {IO, runIO, withEffects, withEffectsP, call, callP} from "../src/io";
import {ap, lift} from "../src/applicative";
import {go, Monad} from "../src/monad";
import {right, left} from "../src/either";
import {add} from "../src/utils";

describe("IO", () => {
  // testFunctor("IO", IO.of(12));
  // testApplicative(IO.of(12));
  it("gives pure computaion", () => {
    return runIO(IO.of(12)).then((res) => {
      assert.equal(12, res);
    });
  });
  it("maps pure computation", () => {
    return runIO(IO.of(12).map((n) => n * n)).then((res) => {
      assert.equal(144, res);
    });
  });
  it("chains computations", () => {
    return runIO(IO.of(3).chain(n => IO.of(n + 4))).then((res) => {
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
      return IO.of(sum);
    });
    return runIO(comp).then((res) => {
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
        return IO.of(a + b);
      });
      return runIO(comp).then((res) => {
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
        const ea = yield wrapped(1, 2);
        assert.strictEqual(variable, 3);
        const eb = yield wrapped(3, 4);
        assert.strictEqual(variable, 10);
        console.log(lift, ea, eb);
        return IO.of(lift(add, ea, eb));
      });
      return runIO(comp).then((res) => {
        assert.deepEqual(res, right(13));
      });
    });
  });
  describe("calling", () => {
    it("calls function", () => {
      let variable = 0;
      function imperative(
        a: number, b: number, c: number, d: number
      ): number {
        variable = a + b + c + d;
        return variable;
      }
      return runIO(call(imperative, 1, 2, 3, 4)).then((res) => {
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
      return runIO(callP(imperative, 1, 2)).then((res) => {
        assert.deepEqual(variable, 3);
        assert.deepEqual(res, right(3));
      });
    });
    it("calls promise returning function that rejects", () => {
      let variable = 0;
      function imperative(a: number, b: number): Promise<number> {
        variable = a + b;
        return Promise.reject(variable);
      }
      return runIO(callP(imperative, 1, 2)).then((res) => {
        assert.deepEqual(variable, 3);
        assert.deepEqual(res, left(3));
      });
    });
  });
});

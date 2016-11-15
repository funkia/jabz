import {assert} from "chai";

import {IO, of, runIO, withEffects, call, callP} from "../src/io";
import {ap} from "../src/applicative";
import {go, Monad} from "../src/monad";
import {right, left} from "../src/either";

describe("IO", () => {
  it("gives pure computaion", () => {
    return runIO(of(12)).then((res) => {
      assert.equal(12, res);
    });
  });
  it("chains computations", () => {
    return runIO(of(3).chain(n => of(n + 4))).then((res) => {
      assert.equal(7, res);
    });
  });
  it("works with do-notation", () => {
    const f1 = withEffects((a: number) => a * 2);
    const f2 = withEffects((a: number, b: number) => a + b);
    const comp: IO<number> = go(function*() {
      const a = yield of(4);
      const b = yield f1(3);
      const sum = yield f2(a, b);
      return of(sum);
    });
    return runIO(comp).then((res) => {
      assert.equal(10, res);
    });
  });
  it("applies function in effects to value in other effects", () => {
    const f1 = of((a: number) => a * 2);
    const f2 = of(3);
    const applied = ap(f1, f2);
    return runIO(applied).then(res => assert.equal(res, 6));
  });
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

import {assert} from "chai";

import {map, mapTo} from "../src/functor";
import {Applicative, lift, applicative} from "../src/applicative";
import {testFunctor} from "./functor";

export function testApplicative<A>(app: Applicative<number>) {
  const of = app.of;
  it("has `ap` method", () => {
    assert.deepEqual(
      of(6).ap(of((n: number) => 2 * n)),
      of(12)
    );
  });
  it("has `lift` function", () => {
    assert.deepEqual(lift((n) => n * 2, of(7)), of(14));
    assert.deepEqual(
      lift((n, m) => n + m, of(1), of(2)),
      of(3)
    );
    assert.deepEqual(
      lift((n, m, o) => n + m + o, of(1), of(2), of(4)),
      of(7)
    );
  });
}

describe("applicative", () => {
  describe("deriving", () => {
    it("can't derive when `of` is missing", () => {
      assert.throws(() => {
        @applicative
        class NotAnApplicative {
          constructor() {};
        }
      });
    });
    it("can't derive when `lift` and `ap` are missing", () => {
      assert.throws(() => {
        @applicative
        class NotAnApplicative<A> {
          constructor(private val: A) {};
          of<B>(b: B): NotAnApplicative<B> {
            return new NotAnApplicative(b);
          }
        }      
      });
    });
    describe("with `of` and `ap`", () => {
      @applicative
      class Container<A> implements Applicative<A> {
        constructor(private val: A) {};
        of<B>(b: B): Container<B> {
          return new Container(b);
        }
        ap<B>(a: Container<(a: A) => B>): Container<B> {
          return new Container(a.val(this.val));
        }
        map: <B>(f: (a: A) => B) => Container<B>;
        mapTo: <B>(b: B) => Container<B>;
        lift: <R>(...args: any[]) => Container<R>;
      }
      const c = <A>(c: A) => new Container(c);
      testFunctor("Container", new Container(0));
      testApplicative(new Container(0));
    });
    describe("with `of` and `lift`", () => {
      @applicative
      class Container<A> implements Applicative<A> {
        constructor(private val: A) {};
        of<B>(b: B): Container<B> {
          return new Container(b);
        }
        ap: <B>(a: Container<(a: A) => B>) => Container<B>;
        map: <B>(f: (a: A) => B) => Container<B>;
        mapTo: <B>(b: B) => Container<B>;
        lift<R>(f: Function, ...args: any[]): Container<R> {
          return new Container(f.apply(undefined, args.map((x) => x.val)));
        }
      }
      testFunctor("Container", new Container(0));
      testApplicative(new Container(0));
    });
  });
});

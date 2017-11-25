import "mocha";
import { assert } from "chai";

import { Applicative, ApplicativeDictionary } from "../src/applicative";
import { Maybe, just } from "../src/maybe";
import { Either } from "../src/either";
import { testFunctor } from "./functor";
import {
  Traversable,
  traversable,
  traverse,
  sequence,
  mapAccumR
} from "../src/traversable";
import { testFoldable } from "./foldable";

export function testTraversable(list: <A>(l: A[]) => Traversable<A>) {
  it("can sequence", () => {
    assert.deepEqual(
      sequence(Maybe, list([just(1), just(2), just(3)])),
      just(list([1, 2, 3]))
    );
  });
  it("can traverse", () => {
    assert.deepEqual(
      traverse(Maybe, just, list([1, 2, 3])),
      just(list([1, 2, 3]))
    );
  });
}

describe("Traversable", () => {
  describe("deriving with `traverse`", () => {
    @traversable
    class List<A> implements Traversable<A> {
      constructor(private list: A[]) {}
      traverse<B>(
        a: ApplicativeDictionary,
        f: (a: A) => Applicative<B>
      ): Applicative<List<B>> {
        return traverse(a, f, this.list).map((a: B[]) => new List(a));
      }
      sequence: <A>(
        a: ApplicativeDictionary,
        t: Traversable<Applicative<A>>
      ) => Applicative<Traversable<A>>;
      map: <B>(f: (a: A) => B) => List<B>;
      mapTo: <B>(b: B) => List<B>;
      foldr: <B>(f: (a: A, b: B) => B, acc: B) => B;
      foldl: <B>(f: (acc: B, a: A) => B, init: B) => B;
      shortFoldr: <B>(f: (a: A, b: B) => Either<B, B>, acc: B) => B;
      shortFoldl: <B>(f: (acc: B, a: A) => Either<B, B>, acc: B) => B;
      size: () => number;
      maximum: () => number;
      minimum: () => number;
      sum: () => number;
    }
    const list = <A>(as: A[]) => new List(as);
    testFunctor("List", new List([1, 2, 3]));
    testFoldable(list);
    testTraversable(list);
    it("has mapAccumR", () => {
      assert.deepEqual(
        mapAccumR((a, b) => [a + b, b * 2], 0, list([1, 2, 3, 4])),
        [10, list([2, 4, 6, 8])] as [number, Traversable<number>]
      );
      assert.deepEqual(
        mapAccumR((a, b) => [a + b, b * 2 + a], 0, list([1, 2, 3, 4])),
        [10, list([11, 11, 10, 8])] as [number, Traversable<number>]
      );
    });
  });
  describe("deriving with `sequence`", () => {
    @traversable
    class List<A> implements Traversable<A> {
      constructor(private list: A[]) {}
      traverse: <B>(
        a: ApplicativeDictionary,
        f: (a: A) => Applicative<B>
      ) => Applicative<List<B>>;
      sequence<A>(
        a: ApplicativeDictionary,
        t: List<Applicative<A>>
      ): Applicative<Traversable<A>> {
        return sequence(a, t.list).map((a: A[]) => new List(a));
      }
      map<B>(f: (a: A) => B): List<B> {
        return new List(this.list.map(f));
      }
      mapTo: <B>(b: B) => List<B>;
      foldr: <B>(f: (a: A, b: B) => B, acc: B) => B;
      foldl: <B>(f: (acc: B, a: A) => B, init: B) => B;
      shortFoldr: <B>(f: (a: A, b: B) => Either<B, B>, acc: B) => B;
      shortFoldl: <B>(f: (acc: B, a: A) => Either<B, B>, acc: B) => B;
      size: () => number;
      maximum: () => number;
      minimum: () => number;
      sum: () => number;
    }
    const list = <A>(as: A[]) => new List(as);
    testFunctor("List", new List([1, 2, 3]));
    testTraversable(list);
  });
  describe("incorrect deriviations", () => {
    it("cannot derive with only `sequence`", () => {
      assert.throws(() => {
        @traversable
        class List<A> {
          constructor(private list: A[]) {}
          sequence<A>(
            a: ApplicativeDictionary,
            t: List<Applicative<A>>
          ): Applicative<List<A>> {
            return sequence(a, t.list).map((a: A[]) => new List(a));
          }
        }
      });
    });
  });
});

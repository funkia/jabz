import "mocha";
import {assert} from "chai";

import {
  Foldable, foldable, foldMap, foldr, foldl, foldrM, size, maximum, minimum,
  sum, find, findLast, findIndex, findLastIndex, toArray, take, sequence_
} from "../src/foldable";
import {Maybe, just, nothing} from "../src/maybe";
import {Either, left, right} from "../src/either";
import {Monoid, MonoidConstructor} from "../src/monoid";
import {IO, call, runIO} from "../src/io";
import Sum from "../src/monoids/sum";

export function testFoldable(list: <A>(l: A[]) => Foldable<A>) {
  it("has foldMap", () => {
    assert.deepEqual(foldMap(Sum, list([1, 2, 3, 4, 5])), Sum.create(15));
  });
  it("empty foldable gives identity element", () => {
    assert.deepEqual(foldMap(Sum, list([])), Sum.create(0));
  });
  it("has foldr", () => {
    assert.deepEqual(
      (list([1, 2, 3, 4, 5])).foldr((n, m) => n + m, 0), 15
    );
    assert.deepEqual(
      foldr((n, m) => n + m, 0, list([1, 2, 3, 4, 5])), 15
    );
  });
  it("folds in right direction", () => {
    assert.deepEqual(
      foldr((n, m) => n - m, 1, list([12, 3, 4])),
      (12 - (3 - (4 - 1)))
    );
  });
  it("has left fold", () => {
    assert.deepEqual(
      foldl((acc, n) => acc - n, 1, list([16, 12, 9, 6, 3])),
      ((((1 - 16) - 12) - 9) - 6) - 3
    );
  });
  it("has short-circuiting foldr", () => {
    assert.deepEqual(
      list([1, 2, 3, 4, 5]).shortFoldr((n, m) => right(n + m), 0), 15
    );
    assert.deepEqual(
      list([1, 2, 3, 4, 5])
        .shortFoldr((n, m) => n === 3 ? left(m) : right(n + m), 0), 9
    );
  });
  it("has short-circuiting foldl", () => {
    assert.deepEqual(
      list([1, 2, 3, 4, 5]).shortFoldl((n, m) => right(n + m), 0), 15
    );
    assert.deepEqual(
      list([4, 4, 2, 3, 3])
        .shortFoldl((m, n) => n === 2 ? left(m) : right(n + m), 0), 8
    );
  });
  it("has size", () => {
    assert.deepEqual(size(list([1, 1, 1, 1])), 4);
  });
  it("can get `maximum`", () => {
    assert.deepEqual(maximum((list([1, 2, 4, 3]))), 4);
  });
  it("can get `minimum`", () => {
    assert.deepEqual(minimum((list([3, 2, 1, 3]))), 1);
  });
  it("can get `sum`", () => {
    assert.deepEqual(sum((list([1, 2, 3, 4]))), 10);
  });
}

describe("Foldable", () => {
  describe("derived foldable implementation", () => {
    @foldable
    class List<A> implements Foldable<A> {
      constructor(private arr: A[]) {};
      foldr<B>(f: (a: A, b: B) => B, acc: B): B {
        for (let i = this.arr.length - 1; 0 <= i; --i) {
          acc = f(this.arr[i], acc);
        }
        return acc;
      }
      foldl: <B>(f: (acc: B, a: A) => B, init: B) => B;
      shortFoldr: <B>(f: (a: A, acc: B) => Either<B, B>, init: B) => B;
      shortFoldl: <B>(f: (acc: B, a: A) => Either<B, B>, init: B) => B;
      size: () => number;
      maximum: () => number;
      minimum: () => number;
      sum: () => number;
    }
    const list = (arr: any[]) => new List(arr);
    testFoldable(list);
    describe("toArray", () => {
      it("can convert foldable to array", () => {
        assert.deepEqual(
          toArray(list([1, 2, 3, 4])),
          [1, 2, 3, 4]
        );
      });
      it("doesn't touch array", () => {
        assert.deepEqual(
          toArray([1, 2, 3, 4]),
          [1, 2, 3, 4]
        );        
      });
    });
    it("can find first element", () => {
      assert.deepEqual(
        find((n) => n > 6, list([1, 8, 3, 7, 5])),
        just(8)
      );
      assert.deepEqual(
        find((n) => n === 3.5, list([1, 2, 3, 4, 5])),
        nothing
      );
    });
    it("can find last element", () => {
      assert.deepEqual(
        findLast((n) => n > 6, list([1, 8, 3, 7, 5])),
        just(7)
      );
      assert.deepEqual(
        findLast((n) => n === 3.5, list([1, 2, 3, 4, 5])),
        nothing
      );
    });
    it("can find index", () => {
      assert.deepEqual(
        findIndex((n) => n % 2 === 0, list([1, 3, 4, 6, 7, 9])), just(2)
      );
      assert.deepEqual(
        findIndex((n) => n % 2 === 0, list([1, 3, 7, 9])), nothing
      );
    });
    it("can find last index", () => {
      assert.deepEqual(
        findLastIndex((n) => n % 2 === 0, list([1, 3, 4, 6, 7, 9])), just(3)
      );
      assert.deepEqual(
        findLastIndex((n) => n % 2 === 0, list([1, 3, 7, 9])), nothing
      );
    });
    it("can take first n elements", () => {
      const l = list([1, 2, 3, 4, 5, 6]);
      assert.deepEqual(take(4, l), [1, 2, 3, 4]);
      assert.deepEqual(take(0, l), []);
    });
    it("can't derive without `fold` method", () => {
      assert.throws(() => {
        @foldable
        class NotAFoldable<A> {
          constructor(private arr: A[]) {};
        }
      });
    });
    describe("sequence_", () => {
      it("sequences justs to just", () => {
        assert.deepEqual(
          sequence_(Maybe, list([just(1), just(2), just(3)])),
          just(undefined)
        );
      });
      it("sequences nothing to nothing", () => {
        assert.deepEqual(
          sequence_(Maybe, list([just(1), nothing, just(3)])), nothing
        );
      });
      it("sequences in right order", () => {
        let results: number[] = [];
        const l = list([
          call(() => results.push(1)),
          call(() => results.push(2)),
          call(() => results.push(3))
        ]);
        const action = sequence_(IO, l);
        return runIO(action).then(() => {
          assert.deepEqual(results, [1, 2, 3]);
        });
      });
    });
    describe("foldrM", () => {
      it("works over foldable", () => {
        const divide = (a: number, b: number) => a === 0 ? nothing : just(b / a);
        assert.deepEqual(
          foldrM(divide, just(100), list([10, 5])),
          just(2)
        );
        assert.deepEqual(
          foldrM(divide, just(100), list([5, 0])),
          nothing
        );
      });
      it("works over array", () => {
        assert.deepEqual(
          foldrM((a, b) => b === a ? nothing : just(b + a), just(2), [4, 3]),
          just(9)
        );
        assert.deepEqual(
          foldrM((a, b) => b === a ? nothing : just(b + a), just(2), [5, 3]),
          nothing
        );
      });
    });
  });
});

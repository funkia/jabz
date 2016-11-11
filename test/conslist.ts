import "mocha";
import {assert} from "chai";

import {Either} from "../src/either";
import {Monad, monad} from "../src/monad";
import {Applicative, ApplicativeDictionary, lift} from "../src/applicative";
import {Traversable, traversable} from "../src/traversable";

import {testFoldable} from "./foldable";
import {testTraversable} from "./traversable";
import {testFunctor} from "./functor";
import {testApplicative} from "./applicative";

describe("cons list", () => {
  @monad @traversable
  class Cons<A> implements Monad<A>, Traversable<A> {
    constructor(private val: A, private tail: Cons<A>) {}
    concat(c: Cons<A>): Cons<A> {
      return this === nil ? c : cons(this.val, this.tail.concat(c));
    }
    of<B>(b: B): Cons<B> {
      return cons(b, nil);
    }
    map<B>(f: (a: A) => B): Cons<B> {
      return this === nil ? nil : cons(f(this.val), this.tail.map(f));
    }
    flatten(): Cons<A> {
      const l = (<Cons<Cons<A>>><any>this);
      return l === nil ? nil : l.val.concat(<any>l.tail.flatten());
    }
    sequence<A>(
      a: ApplicativeDictionary,
      t: Cons<Applicative<A>>
    ): Applicative<Traversable<A>> {
      return t === nil ? a.of(nil) : lift(cons, t.val, this.sequence(a, t.tail));
    }
    // To make TypeScript pleased
    mapTo: <B>(b: B) => Monad<B>;
    ap: <B>(a: Monad<(a: A) => B>) => Monad<B>;
    lift: (f: Function, ...ms: any[]) => Monad<any>;
    multi: boolean;
    chain: <B>(f: (a: A) => Monad<B>) => Monad<B>;
    foldr: <B>(f: (a: A, b: B) => B, acc: B) => B;
    traverse: <B>(a: ApplicativeDictionary, f: (a: A) => Applicative<B>) => Applicative<Cons<B>>;
    shortFoldr: <B>(f: (a: A, b: B) => Either<B, B>, acc: B) => B;
    size: () => number;
    maximum: () => number;
    minimum: () => number;
    sum: () => number;
  }
  const nil = new Cons(undefined, undefined);
  function cons<A>(a: A, as: Cons<A>) {
    return new Cons(a, as);
  }
  function fromArray<A>(as: A[]): Cons<A> {
    return as.length === 0 ? nil : cons(as[0], fromArray(as.slice(1)));
  }
  it("can be created from array", () => {
    assert.deepEqual(fromArray([1, 2, 3, 4]),
                     cons(1, cons(2, cons(3, cons(4, nil)))));
  });
  it("can be concatenated", () => {
    assert.deepEqual(
      fromArray([1, 2, 3]).concat(fromArray([4, 5])),
      fromArray([1, 2, 3, 4, 5])
    )
  });
  it("can flatten", () => {
    assert.deepEqual(
      fromArray([fromArray([1, 2]), fromArray([3]), fromArray([4, 5])]).flatten(),
      fromArray([1, 2, 3, 4, 5])
    );
  });
  testFunctor("Cons", cons(1, nil))
  testApplicative(cons(1, nil));
  testFoldable(fromArray);
  testTraversable(fromArray);
});


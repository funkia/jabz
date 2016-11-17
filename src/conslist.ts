import {Applicative, ApplicativeDictionary, lift} from "./applicative";
import {Traversable, traversable} from "./traversable";
import {Monad, monad} from "./monad";
import {Either} from "./either";

@monad @traversable
export class Cons<A> implements Monad<A>, Traversable<A> {
  constructor(private val: A, private tail: Cons<A>) {}
  concat(c: Cons<A>): Cons<A> {
    return this === nil ? c : cons(this.val, this.tail.concat(c));
  }
  of<B>(b: B): Cons<B> {
    return cons(b, nil);
  }
  chain<B>(f: (a: A) => Cons<B>): Cons<B> {
    return this === nil ? nil : f(this.val).concat(this.tail.chain(f));
  }
  traverse<B>(a: ApplicativeDictionary, f: (a: A) => Applicative<B>): Applicative<Cons<B>> {
    return this === nil ? a.of(nil) : lift(cons, f(this.val), this.tail.traverse(a, f));
  }
  // To make TypeScript pleased
  map: <B>(f: (a: A) => B) => Cons<B>;
  mapTo: <B>(b: B) => Cons<B>;
  ap: <B>(a: Monad<(a: A) => B>) => Cons<B>;
  lift: (f: Function, ...ms: any[]) => Cons<any>;
  multi: boolean;
  flatten: () => Cons<A>;
  foldr: <B>(f: (a: A, b: B) => B, acc: B) => B;
  sequence: <A>(a: ApplicativeDictionary, t: Cons<Applicative<A>>) => Applicative<Traversable<A>>;
  shortFoldr: <B>(f: (a: A, b: B) => Either<B, B>, acc: B) => B;
  size: () => number;
  maximum: () => number;
  minimum: () => number;
  sum: () => number;
}

export const nil = new Cons(undefined, undefined);

export function cons<A>(a: A, as: Cons<A>) {
  return new Cons(a, as);
}

export function fromArray<A>(as: A[]): Cons<A> {
  return as.length === 0 ? nil : cons(as[0], fromArray(as.slice(1)));
}

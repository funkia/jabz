import {functor} from "./functor";
import {AbstractApplicative} from "./applicative";

export default class Identity<A> extends AbstractApplicative<A> {
  constructor(private val: A) { super(); };
  static of<A>(a: A): Identity<A> {
    return new Identity(a);
  }
  of<A>(a: A): Identity<A> {
    return new Identity(a);
  }
  ap<B>(f: Identity<(a: A) => B>): Identity<B> {
    return new Identity(f.val(this.val));
  }
  extract(): A {
    return this.val;
  }
  map<B>(f: (a: A) => B): Identity<B> {
    return new Identity(f(this.val));
  }
}

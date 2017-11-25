import { functor } from "./functor";
import { Monad, monad } from "./monad";
import { AbstractApplicative } from "./applicative";

@monad
export default class Identity<A> implements Monad<A> {
  constructor(private val: A) {}
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
  mapTo<B>(b: B): Identity<B> {
    return this.of(b);
  }
  flatten(): Identity<any> {
    return this.val as any;
  }
  chain<B>(f: (a: A) => Identity<B>): Identity<B> {
    return f(this.val);
  }
  multi = false;
  static multi = false;
  lift: (f: Function, ...ms: any[]) => Identity<any>;
}

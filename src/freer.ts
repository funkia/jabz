import { Functor } from "./functor";
import { AbstractMonad, Monad, monad } from "./monad";

export type FreerMatch<F, A, K> = {
  pure: (a: A) => K;
  bind: (u: F, k: (a: any) => Freer<F, A>) => K;
};

export abstract class Freer<F, A> extends AbstractMonad<A> {
  static of<B>(b: B): Freer<any, B> {
    return new Pure(b);
  }
  of<B>(b: B): Freer<F, B> {
    return new Pure(b);
  }
  abstract match<K>(m: FreerMatch<F, A, K>): K;
  abstract map<B>(f: (a: A) => B): Freer<F, B>;
  multi: false;
  static multi = false;
  abstract chain<B>(f: (a: A) => Freer<F, B>): Freer<F, B>;
}

@monad
export class Pure<F, A> extends Freer<F, A> {
  constructor(private a: A) {
    super();
  }
  match<K>(m: FreerMatch<F, A, K>): K {
    return m.pure(this.a);
  }
  map<B>(f: (a: A) => B): Freer<F, B> {
    return new Pure(f(this.a));
  }
  chain<B>(f: (a: A) => Freer<F, B>): Freer<F, B> {
    return f(this.a);
  }
}

function pure<F, A>(a: A): Freer<F, A> {
  return new Pure(a);
}

@monad
export class Bind<F, A> extends Freer<F, A> {
  constructor(public val: any, public f: (a: any) => Freer<F, A>) {
    super();
  }
  match<K>(m: FreerMatch<F, A, K>): K {
    return m.bind(this.val, this.f);
  }
  map<B>(f: (a: A) => B): Freer<F, B> {
    return new Bind(this.val, (a: any) => this.f(a).map(f));
  }
  chain<B>(f: (a: A) => Freer<F, B>): Freer<F, B> {
    return new Bind(this.val, (a: any) => this.f(a).chain(f));
  }
}

export function liftF<F, A>(fa: any): Freer<F, A> {
  return new Bind(fa, pure);
}

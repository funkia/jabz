import {Monad, AbstractMonad} from "./monad";

type ImpureComp<A> = () => Promise<A>;

export class IO<A> extends AbstractMonad<A> {
  constructor(public comp: ImpureComp<A>) {
    super();
  }
  map<B>(f: (a: A) => B): IO<B> {
    return this.chain(v => this.of(f(v)));
  }
  of<B>(k: B): IO<B> {
    return new IO(() => Promise.resolve(k));
  }
  chain<B>(f: (a: A) => IO<B>): IO<B> {
    return new IO(() => this.comp().then(r => f(r).comp()));
  }
}

export function of<B>(k: B): IO<B> {
  return new IO(() => Promise.resolve(k));
}

export function runEffects<A>(e: IO<A>): Promise<A> {
  return e.comp();
}

export function thunk<A>(t: () => IO<A>): IO<A> {
  return new IO(() => t().comp());
}

export function wrapEffects<A>(f: () => A): IO<A> {
  return new IO(() => Promise.resolve(f()));
}

// takes an impure function an converts it to a computation
// in the effects monad
export function withEffects<A>(fn: any): (...as: any[]) => IO<A> {
  return (...args: any[]) => new IO(() => Promise.resolve(fn(...args)));
}

export function withEffectsP<A>(fn: (...as: any[]) => Promise<A>): (...a: any[]) => IO<A> {
  return (...args: any[]) => new IO(() => fn(...args));
}

export function fromPromise<A>(p: Promise<A>): IO<A> {
  return new IO(() => p);
}

export function ap<A, B>(fe: IO<(a: A) => B>, ve: IO<A>): IO<B> {
  return fe.chain(f => ve.chain(v => of(f(v))));
}

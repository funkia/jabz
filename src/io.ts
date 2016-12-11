import {Monad, AbstractMonad} from "./monad";
import {Either, left, right} from "./either";

export type F0<Z> =
  () => Z;
export type F1<A, Z> =
  (a: A) => Z;
export type F2<A, B, Z> =
  (a: A, b: B) => Z;
export type F3<A, B, C, Z> =
  (a: A, b: B, c: C) => Z;
export type F4<A, B, C, D, Z> =
  (a: A, b: B, c: C, d: D) => Z;
export type F5<A, B, C, D, E, Z> =
  (a: A, b: B, c: C, d: D, e: E) => Z;

export type ImpureComp<A> = () => Promise<A>;

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
  static of<B>(k: B): IO<B> {
    return new IO(() => Promise.resolve(k));
  }
  chain<B>(f: (a: A) => IO<B>): IO<B> {
    return new IO(() => this.comp().then(r => f(r).comp()));
  }
  static multi: boolean = false;
  multi: boolean = false;
}

export function runIO<A>(e: IO<A>): Promise<A> {
  return e.comp();
}

// takes an impure function an converts it to a computation
// in the IO monad
export function withEffects<A, Z>(f: F1<A, Z>): (a: A) => IO<Z>;
export function withEffects<A, B, Z>(f: F2<A, B, Z>): (a: A, b: B) => IO<Z>;
export function withEffects<A, B, C, Z>(f: F3<A, B, C, Z>): (a: A, b: B, c: C) => IO<Z>;
export function withEffects<A, B, C, D, Z>(f: F4<A, B, C, D, Z>): (a: A, b: B, c: C, d: D) => IO<Z>;
export function withEffects<A, B, C, D, E, Z>(f: F5<A, B, C, D, E, Z>): (a: A, b: B, c: C, d: D, e: E) => IO<Z>;
export function withEffects<A>(fn: any): (...as: any[]) => IO<A> {
  return (...args: any[]) => new IO(() => Promise.resolve(fn(...args)));
}

export function withEffectsP<A, Z>(f: F1<A, Promise<Z>>): (a: A) => IO<Either<any, Z>>;
export function withEffectsP<A, B, Z>(f: F2<A, B, Promise<Z>>): (a: A, b: B) => IO<Either<any, Z>>;
export function withEffectsP<A, B, C, Z>(f: F3<A, B, C, Promise<Z>>): (a: A, b: B, c: C) => IO<Either<any, Z>>;
export function withEffectsP<A, B, C, D, Z>(f: F4<A, B, C, D, Promise<Z>>): (a: A, b: B, c: C, d: D) => IO<Either<any, Z>>;
export function withEffectsP<A, B, C, D, E, Z>(f: F5<A, B, C, D, E, Promise<Z>>): (a: A, b: B, c: C, d: D, e: E) => IO<Either<any, Z>>;
export function withEffectsP<A>(fn: (...as: any[]) => Promise<A>): (...a: any[]) => IO<Either<any, A>> {
  return (...args: any[]) => new IO(() => fn(...args).then(right).catch(left));
}

export function call<Z>(f: F0<Z>): IO<Z>;
export function call<A, Z>(f: F1<A, Z>, a: A): IO<Z>;
export function call<A, B, Z>(f: F2<A, B, Z>, a: A, b: B): IO<Z>;
export function call<A, B, C, Z>(f: F3<A, B, C, Z>, a: A, b: B, c: C): IO<Z>;
export function call<A, B, C, D, Z>(f: F4<A, B, C, D, Z>, a: A, b: B, c: C, d: D): IO<Z>;
export function call<A, B, C, D, E, Z>(f: F5<A, B, C, D, E, Z>, a: A, b: B, c: C, d: D, e: E): IO<Z>;
export function call(f: Function, ...args: any[]): IO<any> {
  return new IO(() => Promise.resolve(f(...args)));
}

export function callP<Z>(f: F0<Z>): IO<Either<any, Z>>;
export function callP<A, Z>(f: F1<A, Promise<Z>>, a: A): IO<Either<any, Z>>;
export function callP<A, B, Z>(f: F2<A, B, Promise<Z>>, a: A, b: B): IO<Either<any, Z>>;
export function callP<A, B, C, Z>(f: F3<A, B, C, Promise<Z>>, a: A, b: B, c: C): IO<Either<any, Z>>;
export function callP<A, B, C, D, Z>(f: F4<A, B, C, D, Promise<Z>>, a: A, b: B, c: C, d: D): IO<Either<any, Z>>;
export function callP<A, B, C, D, E, Z>(f: F5<A, B, C, D, E, Promise<Z>>, a: A, b: B, c: C, d: D, e: E): IO<Either<any, Z>>;
export function callP(f: Function, ...args: any[]): IO<any> {
  return new IO(() => f(...args).then(right).catch(left));
}

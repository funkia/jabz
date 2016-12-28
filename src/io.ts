import {Monad, AbstractMonad} from "./monad";
import {Either, left, right} from "./either";
import {Freer, liftF} from "./freer";
import {deepEqual} from "./utils";

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

export type IOValue<A> = Call | CallP;

export class Call {
  type: "call" = "call";
  constructor(public fn: Function, public args: any[]) {}
}

export class CallP {
  type: "callP" = "callP";
  constructor(public fn: Function, public args: any[]) {}
}

export type IO<A> = Freer<IOValue<any>, A>;

export const IO = Freer;

// in the IO monad
export function withEffects<A, Z>(f: F1<A, Z>): (a: A) => IO<Z>;
export function withEffects<A, B, Z>(f: F2<A, B, Z>): (a: A, b: B) => IO<Z>;
export function withEffects<A, B, C, Z>(f: F3<A, B, C, Z>): (a: A, b: B, c: C) => IO<Z>;
export function withEffects<A, B, C, D, Z>(f: F4<A, B, C, D, Z>): (a: A, b: B, c: C, d: D) => IO<Z>;
export function withEffects<A, B, C, D, E, Z>(f: F5<A, B, C, D, E, Z>): (a: A, b: B, c: C, d: D, e: E) => IO<Z>;
export function withEffects<A>(fn: any): (...as: any[]) => IO<A> {
  return (...args: any[]) => liftF(new Call(fn, args));
}

export function withEffectsP<A, Z>(f: F1<A, Promise<Z>>): (a: A) => IO<Either<any, Z>>;
export function withEffectsP<A, B, Z>(f: F2<A, B, Promise<Z>>): (a: A, b: B) => IO<Either<any, Z>>;
export function withEffectsP<A, B, C, Z>(f: F3<A, B, C, Promise<Z>>): (a: A, b: B, c: C) => IO<Either<any, Z>>;
export function withEffectsP<A, B, C, D, Z>(f: F4<A, B, C, D, Promise<Z>>): (a: A, b: B, c: C, d: D) => IO<Either<any, Z>>;
export function withEffectsP<A, B, C, D, E, Z>(f: F5<A, B, C, D, E, Promise<Z>>): (a: A, b: B, c: C, d: D, e: E) => IO<Either<any, Z>>;
export function withEffectsP<A>(fn: (...as: any[]) => Promise<A>): (...a: any[]) => IO<Either<any, A>> {
  return (...args: any[]) => liftF(new CallP(fn, args));
}

export function call<Z>(f: F0<Z>): IO<Z>;
export function call<A, Z>(f: F1<A, Z>, a: A): IO<Z>;
export function call<A, B, Z>(f: F2<A, B, Z>, a: A, b: B): IO<Z>;
export function call<A, B, C, Z>(f: F3<A, B, C, Z>, a: A, b: B, c: C): IO<Z>;
export function call<A, B, C, D, Z>(f: F4<A, B, C, D, Z>, a: A, b: B, c: C, d: D): IO<Z>;
export function call<A, B, C, D, E, Z>(f: F5<A, B, C, D, E, Z>, a: A, b: B, c: C, d: D, e: E): IO<Z>;
export function call(fn: Function, ...args: any[]): IO<any> {
  return liftF(new Call(fn, args));
}

export function callP<Z>(f: F0<Z>): IO<Either<any, Z>>;
export function callP<A, Z>(f: F1<A, Promise<Z>>, a: A): IO<Either<any, Z>>;
export function callP<A, B, Z>(f: F2<A, B, Promise<Z>>, a: A, b: B): IO<Either<any, Z>>;
export function callP<A, B, C, Z>(f: F3<A, B, C, Promise<Z>>, a: A, b: B, c: C): IO<Either<any, Z>>;
export function callP<A, B, C, D, Z>(f: F4<A, B, C, D, Promise<Z>>, a: A, b: B, c: C, d: D): IO<Either<any, Z>>;
export function callP<A, B, C, D, E, Z>(f: F5<A, B, C, D, E, Promise<Z>>, a: A, b: B, c: C, d: D, e: E): IO<Either<any, Z>>;
export function callP(fn: Function, ...args: any[]): IO<any> {
  return liftF(new CallP(fn, args));
}

export function runIO<A>(e: IO<A>): Promise<A> {
  return e.match({
    pure: (a) => Promise.resolve(a),
    bind: (io, cont) => {
      switch (io.type) {
      case "call":
        return runIO(cont(io.fn(...io.args)));
      case "callP":
        return io.fn(...io.args)
          .then((a: A) => runIO(cont(right(a))))
          .catch((a: A) => runIO(cont(left(a))));
      }
    }
  });
}

function doTestIO<A>(e: IO<A>, arr: any[], ending: A, idx: number): void {
  e.match({
    pure: (a2) => {
      if (ending !== a2) {
        throw new Error(
          `Pure value invalid, expected ${ending} but saw ${a2}`
        );
      }
    },
    bind: (io, cont) => {
      const [{val: io2}, a] = arr[idx];
      if (!deepEqual(io, io2)) {
        throw new Error(`Value invalid, expected ${io2} but saw ${io}`);
      } else {
        doTestIO(cont(a), arr, ending, idx + 1);
      }
    }
  });
}

export function testIO<A>(e: IO<A>, arr: any[], a: A): void {
  doTestIO(e, arr, a, 0);
}

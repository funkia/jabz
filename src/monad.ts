import {Applicative} from "./applicative";

function id<A>(a: A) {
  return a;
}

export interface Monad<A> extends Applicative<A> {
  chain: <B>(f: (a: A) => Monad<B>) => Monad<B>;
}

export function join<A>(m: Monad<Monad<A>>) {
  return m.chain(id);
}

export function Do(gen: () => Iterator<Monad<any>>): Monad<any> {
  const doing = gen();
  function doRec(v: any): Monad<any> {
    const a = doing.next(v);
    if (a.done === true) {
      return a.value;
    } else if (typeof a.value !== "undefined") {
      return a.value.chain(doRec);
    } else {
      throw new Error("Expected monad value");
    }
  }
  return doRec(undefined);
};

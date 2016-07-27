import {Foldable} from "./foldable";
import {MonoidConstructor, Monoid} from "./monoid";

export type List<A> = ListImpl<A>;

class ListImpl<A> implements Foldable<A> {
  constructor(public arr: [A]) {};
  foldMap<M extends Monoid<M>>(f: MonoidConstructor<A, M>): M {
    let m = f.identity;
    for (let i = 0; i < this.arr.length; ++i) {
      m = m.merge(f(this.arr[i]));
    }
    return m;
  }
}

export function fromArray<A>(arr: [A]): List<A> {
  return new ListImpl(arr);
}

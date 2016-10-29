import {Foldable, AbstractFoldable} from "./foldable";
import {MonoidConstructor, Monoid} from "./monoid";

export type List<A> = ListImpl<A>;

export class ListImpl<A> extends AbstractFoldable<A> {
  constructor(public arr: A[]) {
    super();
  };
  foldMapId<M extends Monoid<M>>(m: M, f: (a: A) => M): M {
    for (let i = 0; i < this.arr.length; ++i) {
      m = m.combine(f(this.arr[i]));
    }
    return m;
  }
}

export function fromArray<A>(arr: A[]): List<A> {
  return new ListImpl(arr);
}
